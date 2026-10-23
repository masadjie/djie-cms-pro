const { Op } = require('sequelize');
const { Berita, KategoriBerita, User, LampiranBerita } = require('../models');
const { getOrSetCache, deletePattern } = require('../config/redis');
const logger = require('../config/logger');

// Generate unique slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Get Public List of Berita with Pagination, Search & Category Filter
 * High Performance with Redis Caching
 */
const getBeritaList = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const offset = (page - 1) * limit;
    const search = req.query.search ? req.query.search.trim() : '';
    const kategori_slug = req.query.kategori ? req.query.kategori.trim() : '';
    const kategori_id = req.query.kategori_id ? req.query.kategori_id.trim() : '';
    const status = req.query.status ? req.query.status.trim() : '';
    const sort = req.query.sort || 'latest';
    const is_featured = req.query.is_featured;
    const is_pinned = req.query.is_pinned;
    const date_from = req.query.date_from;
    const date_to = req.query.date_to;
    const isAdmin = req.query.admin === 'true' || !!req.headers.authorization;

    const cacheKey = `berita:list:p${page}:l${limit}:s${search}:k${kategori_slug}:kid${kategori_id}:st${status}:adm${isAdmin}:sort${sort}:f${is_featured}:p${is_pinned}:df${date_from}:dt${date_to}`;

    const result = await getOrSetCache(cacheKey, async () => {
      const whereClause = {};

      if (status && status !== 'ALL') {
        whereClause.status = status;
      } else if (!isAdmin && !status) {
        whereClause.status = 'PUBLISHED';
      }

      // If visitor (non-admin), only show articles whose scheduled published_at has arrived
      if (!isAdmin) {
        whereClause.published_at = {
          [Op.or]: [
            { [Op.lte]: new Date() },
            { [Op.eq]: null }
          ]
        };
      }

      if (kategori_id && kategori_id !== 'ALL') {
        whereClause.kategori_id = parseInt(kategori_id, 10);
      }

      if (is_featured !== undefined && is_featured !== '') {
        whereClause.is_featured = is_featured === 'true' || is_featured === '1';
      }

      if (is_pinned !== undefined && is_pinned !== '') {
        whereClause.is_pinned = is_pinned === 'true' || is_pinned === '1';
      }

      if (date_from || date_to) {
        whereClause.created_at = {};
        if (date_from) whereClause.created_at[Op.gte] = new Date(date_from);
        if (date_to) {
          const endOfDay = new Date(date_to);
          endOfDay.setHours(23, 59, 59, 999);
          whereClause.created_at[Op.lte] = endOfDay;
        }
      }

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { excerpt: { [Op.like]: `%${search}%` } },
          { author_name: { [Op.like]: `%${search}%` } }
        ];
      }

      const includeClause = [
        {
          model: KategoriBerita,
          as: 'kategori',
          attributes: ['id', 'nama_kategori', 'slug']
        }
      ];

      if (kategori_slug && kategori_slug !== 'ALL') {
        includeClause[0].where = { slug: kategori_slug };
      }

      let orderClause = [['published_at', 'DESC'], ['created_at', 'DESC']];
      if (sort === 'popular') {
        orderClause = [['views_count', 'DESC'], ['published_at', 'DESC']];
      } else if (sort === 'oldest') {
        orderClause = [['created_at', 'ASC']];
      } else if (sort === 'title_asc') {
        orderClause = [['title', 'ASC']];
      } else if (sort === 'title_desc') {
        orderClause = [['title', 'DESC']];
      } else if (sort === 'featured') {
        orderClause = [['is_pinned', 'DESC'], ['is_featured', 'DESC'], ['published_at', 'DESC']];
      }

      const { count, rows } = await Berita.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit,
        offset,
        attributes: [
          'id', 'title', 'slug', 'excerpt', 'cover_image', 'cover_caption',
          'author_name', 'status', 'published_at', 'views_count', 'is_featured', 'is_pinned',
          'read_time_minutes', 'created_at'
        ]
      });

      return {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        data: rows
      };
    }, 300); // 5 min cache

    return res.json({
      success: true,
      message: 'Berita berhasil dimuat',
      ...result
    });
  } catch (error) {
    logger.error(`Error getBeritaList: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengambil data berita' });
  }
};

/**
 * Get Detail Berita by Slug with Views increment & SEO Structured Schema
 */
const getBeritaBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug berita diperlukan' });
    }

    const isAdmin = req.query.admin === 'true' || !!req.headers.authorization;
    const cacheKey = `berita:detail:${slug}:adm${isAdmin}`;
    let berita = await getOrSetCache(cacheKey, async () => {
      const pubWhere = { slug, status: 'PUBLISHED' };
      if (!isAdmin) {
        pubWhere.published_at = {
          [Op.or]: [{ [Op.lte]: new Date() }, { [Op.eq]: null }]
        };
      }
      let article = await Berita.findOne({
        where: pubWhere,
        include: [
          {
            model: KategoriBerita,
            as: 'kategori',
            attributes: ['id', 'nama_kategori', 'slug']
          },
          {
            model: LampiranBerita,
            as: 'lampiran',
            attributes: ['id', 'nama_lampiran', 'original_filename', 'file_url', 'file_type', 'file_size_bytes', 'file_extension', 'kategori_dokumen', 'downloads_count']
          }
        ]
      });

      // Jika tidak ditemukan exact, coba cari berdasarkan partial / prefix / keywords slug
      if (!article) {
        const cleanSlug = slug.replace(/^(bkpsdm-aceh-tamiang-|pemerintah-kabupaten-aceh-tamiang-)/i, '');
        const fallbackWhere = {
          status: 'PUBLISHED',
          [Op.or]: [
            { slug: { [Op.like]: `%${cleanSlug}%` } },
            { title: { [Op.like]: `%${cleanSlug.replace(/-/g, '%')}%` } }
          ]
        };
        if (!isAdmin) {
          fallbackWhere.published_at = {
            [Op.or]: [{ [Op.lte]: new Date() }, { [Op.eq]: null }]
          };
        }
        article = await Berita.findOne({
          where: fallbackWhere,
          include: [
            {
              model: KategoriBerita,
              as: 'kategori',
              attributes: ['id', 'nama_kategori', 'slug']
            },
            {
              model: LampiranBerita,
              as: 'lampiran',
              attributes: ['id', 'nama_lampiran', 'original_filename', 'file_url', 'file_type', 'file_size_bytes', 'file_extension', 'kategori_dokumen', 'downloads_count']
            }
          ]
        });
      }

      return article ? article.toJSON() : null;
    }, 600); // 10 min cache

    if (!berita) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    // Increment view asynchronously in database
    Berita.increment('views_count', { by: 1, where: { id: berita.id } }).catch((err) =>
      logger.warn(`Failed to increment views for berita id ${berita.id}: ${err.message}`)
    );

    // Ensure the response returned to client has the updated views_count
    if (berita && typeof berita.views_count === 'number') {
      berita.views_count += 1;
    }

    // Build SEO Schema JSON-LD (NewsArticle)
    const siteUrl = process.env.CLIENT_URL || 'https://bkpsdm.acehtamiangkab.go.id';
    const articleUrl = `${siteUrl}/berita/${berita.slug}`;
    const schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: berita.title,
      description: berita.meta_description || berita.excerpt,
      image: [berita.cover_image || `${siteUrl}/hero-tamiang.jpg`],
      datePublished: berita.published_at || berita.created_at,
      dateModified: berita.updated_at || berita.published_at,
      author: {
        '@type': 'Organization',
        name: berita.author_name || 'BKPSDM Kabupaten Aceh Tamiang',
        url: siteUrl
      },
      publisher: {
        '@type': 'GovernmentOrganization',
        name: 'BKPSDM Kabupaten Aceh Tamiang',
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/logo-tamiang.png`
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl
      }
    };

    return res.json({
      success: true,
      data: berita,
      seo: {
        title: berita.meta_title || `${berita.title} | BKPSDM Kab. Aceh Tamiang`,
        description: berita.meta_description || berita.excerpt,
        keywords: berita.meta_keywords || `${berita.kategori?.nama_kategori}, BKPSDM Aceh Tamiang, ASN Aceh Tamiang, Kepegawaian`,
        canonicalUrl: berita.canonical_url || articleUrl,
        ogImage: berita.cover_image || `${siteUrl}/hero-tamiang.jpg`,
        schemaJsonLd
      }
    });
  } catch (error) {
    logger.error(`Error getBeritaBySlug: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail berita' });
  }
};

/**
 * Get Trending & Featured Berita for Homepage & Sidebar
 */
const getBeritaTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '5', 10);
    const cacheKey = `berita:trending:${limit}`;

    const data = await getOrSetCache(cacheKey, async () => {
      return await Berita.findAll({
        where: {
          status: 'PUBLISHED',
          published_at: {
            [Op.or]: [{ [Op.lte]: new Date() }, { [Op.eq]: null }]
          }
        },
        include: [{ model: KategoriBerita, as: 'kategori', attributes: ['id', 'nama_kategori', 'slug'] }],
        order: [['views_count', 'DESC'], ['published_at', 'DESC']],
        limit,
        attributes: ['id', 'title', 'slug', 'cover_image', 'published_at', 'views_count', 'author_name']
      });
    }, 600);

    return res.json({ success: true, data });
  } catch (error) {
    logger.error(`Error getBeritaTrending: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengambil berita trending' });
  }
};

/**
 * Track Social Share & Click Analytics for Berita
 */
const trackShareBerita = async (req, res) => {
  try {
    const { slug } = req.params;
    const { platform = 'whatsapp' } = req.body; // whatsapp, facebook, twitter, telegram, linkedin, copy_link

    const berita = await Berita.findOne({ where: { slug } });
    if (!berita) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan.' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    // Log this sharing event into visitor_logs
    await VisitorLog.create({
      ip_address: ip.replace(/^.*:/, ''),
      path: `/berita/${slug}?shared=${platform}`,
      referrer: platform.toUpperCase(),
      referrer_type: 'SOCIAL',
      created_at: new Date()
    });

    // Also increment views slightly as social interaction engagement
    await Berita.increment('views_count', { by: 1, where: { id: berita.id } });

    // Invalidate Redis detail cache so updated engagement is fresh
    await deletePattern(`berita:detail:${slug}`);

    // Count total shares recorded for this article
    const shareCount = await VisitorLog.count({
      where: {
        path: { [Op.like]: `/berita/${slug}?shared=%` }
      }
    });

    return res.status(200).json({
      success: true,
      message: `Bagikan ke ${platform} berhasil dicatat.`,
      shareCount: shareCount + 1,
      platform
    });
  } catch (error) {
    logger.error(`Error in trackShareBerita: ${error.message}`);
    return res.status(200).json({ success: true, message: 'Share tracked.' });
  }
};

const getBeritaShareAnalytics = async (req, res) => {
  try {
    const { slug } = req.params;
    const shareLogs = await VisitorLog.findAll({
      where: {
        path: { [Op.like]: `/berita/${slug}?shared=%` }
      },
      attributes: ['referrer', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['referrer'],
      raw: true
    });

    let totalShares = 0;
    const breakdown = {};
    shareLogs.forEach((item) => {
      const p = (item.referrer || 'OTHER').toLowerCase();
      const count = parseInt(item.count || 0, 10);
      breakdown[p] = count;
      totalShares += count;
    });

    return res.status(200).json({
      success: true,
      totalShares,
      breakdown
    });
  } catch (error) {
    logger.error(`Error in getBeritaShareAnalytics: ${error.message}`);
    return res.status(200).json({ success: true, totalShares: 0, breakdown: {} });
  }
};


/**
 * Get Categories of Berita for Public
 */
const getKategoriBeritaList = async (req, res) => {
  try {
    const cacheKey = 'berita:kategori:list';
    const data = await getOrSetCache(cacheKey, async () => {
      return await KategoriBerita.findAll({
        where: { is_active: true },
        order: [['urutan', 'ASC'], ['nama_kategori', 'ASC']]
      });
    }, 1800);

    return res.json({ success: true, data });
  } catch (error) {
    logger.error(`Error getKategoriBeritaList: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengambil kategori berita' });
  }
};

/**
 * Admin: Get All Categories with Article Count
 */
const getKategoriAdminList = async (req, res) => {
  try {
    const categories = await KategoriBerita.findAll({
      order: [['urutan', 'ASC'], ['id', 'ASC']]
    });

    const results = await Promise.all(
      categories.map(async (cat) => {
        const count = await Berita.count({ where: { kategori_id: cat.id } });
        return {
          ...cat.toJSON(),
          total_berita: count
        };
      })
    );

    return res.json({ success: true, data: results });
  } catch (error) {
    logger.error(`Error getKategoriAdminList: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal memuat kategori' });
  }
};

/**
 * Admin: Create New Category
 */
const createKategoriBerita = async (req, res) => {
  try {
    const { nama_kategori, slug, deskripsi, urutan, is_active } = req.body;

    if (!nama_kategori) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    }

    let finalSlug = slug ? createSlug(slug) : createSlug(nama_kategori);
    if (!finalSlug) finalSlug = `kategori-${Date.now().toString().slice(-4)}`;

    let uniqueSlug = finalSlug;
    let count = 1;
    while (await KategoriBerita.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${finalSlug}-${count++}`;
    }

    const newCategory = await KategoriBerita.create({
      nama_kategori,
      slug: uniqueSlug,
      deskripsi: deskripsi || '',
      urutan: parseInt(urutan || '0', 10),
      is_active: is_active !== undefined ? !!is_active : true
    });

    await deletePattern('berita:kategori:*');
    await deletePattern('berita:list:*');

    return res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: newCategory
    });
  } catch (error) {
    logger.error(`Error createKategoriBerita: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update Category
 */
const updateKategoriBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await KategoriBerita.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    const { nama_kategori, slug, deskripsi, urutan, is_active } = req.body;

    let updatedSlug = category.slug;
    if (slug && slug !== category.slug) {
      let candidateSlug = createSlug(slug);
      let count = 1;
      while (await KategoriBerita.findOne({ where: { slug: candidateSlug, id: { [Op.ne]: id } } })) {
        candidateSlug = `${createSlug(slug)}-${count++}`;
      }
      updatedSlug = candidateSlug;
    }

    await category.update({
      nama_kategori: nama_kategori !== undefined ? nama_kategori : category.nama_kategori,
      slug: updatedSlug,
      deskripsi: deskripsi !== undefined ? deskripsi : category.deskripsi,
      urutan: urutan !== undefined ? parseInt(urutan, 10) : category.urutan,
      is_active: is_active !== undefined ? !!is_active : category.is_active
    });

    await deletePattern('berita:kategori:*');
    await deletePattern('berita:list:*');

    return res.json({
      success: true,
      message: 'Kategori berhasil diperbarui',
      data: category
    });
  } catch (error) {
    logger.error(`Error updateKategoriBerita: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Delete Category
 */
const deleteKategoriBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await KategoriBerita.findByPk(id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }

    // Check if category has articles
    const articleCount = await Berita.count({ where: { kategori_id: id } });
    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak dapat dihapus karena masih digunakan oleh ${articleCount} artikel berita.`
      });
    }

    await category.destroy();
    await deletePattern('berita:kategori:*');
    await deletePattern('berita:list:*');

    return res.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    });
  } catch (error) {
    logger.error(`Error deleteKategoriBerita: ${error.message}`);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Get Berita Detail by ID for Editor
 */
const getBeritaById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Berita.findByPk(id, {
      include: [
        { model: KategoriBerita, as: 'kategori', attributes: ['id', 'nama_kategori', 'slug'] },
        {
          model: LampiranBerita,
          as: 'lampiran',
          attributes: ['id', 'nama_lampiran', 'original_filename', 'file_url', 'file_type', 'file_size_bytes', 'file_extension', 'kategori_dokumen', 'downloads_count']
        }
      ]
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    return res.json({ success: true, data: article });
  } catch (error) {
    logger.error(`Error getBeritaById: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal mengambil detail berita' });
  }
};

/**
 * Admin: Create New Berita
 */
const createBerita = async (req, res) => {
  try {
    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      cover_image, 
      cover_caption, 
      kategori_id, 
      kategori_ids,
      status, 
      published_at, 
      is_featured, 
      is_pinned, 
      meta_title, 
      meta_description, 
      meta_keywords, 
      canonical_url,
      author_name,
      attachment_ids
    } = req.body;

    if (!title || !content || !kategori_id) {
      return res.status(400).json({ success: false, message: 'Judul, konten, dan kategori wajib diisi' });
    }

    let finalSlug = slug ? createSlug(slug) : createSlug(title);
    if (!finalSlug) finalSlug = `berita-${Date.now().toString().slice(-4)}`;

    let uniqueSlug = finalSlug;
    let count = 1;
    while (await Berita.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${finalSlug}-${count++}`;
    }

    // Process multiple categories (WordPress style)
    let processedCategoryIds = [parseInt(kategori_id, 10)];
    if (Array.isArray(kategori_ids) && kategori_ids.length > 0) {
      processedCategoryIds = kategori_ids.map(Number).filter(n => !isNaN(n));
      if (!processedCategoryIds.includes(parseInt(kategori_id, 10))) {
        processedCategoryIds.unshift(parseInt(kategori_id, 10));
      }
    }

    // Calculate reading time (~200 words per minute)
    const wordCount = content.replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const newArticle = await Berita.create({
      title,
      slug: uniqueSlug,
      excerpt: excerpt || content.replace(/<[^>]*>?/gm, '').slice(0, 180) + '...',
      content,
      cover_image: cover_image || 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      cover_caption: cover_caption || '',
      kategori_id: parseInt(kategori_id, 10),
      kategori_ids: processedCategoryIds,
      author_id: req.user?.id || null,
      author_name: author_name || req.user?.name || 'Humas BKPSDM Aceh Tamiang',
      status: status || 'PUBLISHED',
      published_at: published_at ? new Date(published_at) : (status === 'PUBLISHED' ? new Date() : null),
      is_featured: !!is_featured,
      is_pinned: !!is_pinned,
      meta_title: meta_title || title,
      meta_description: meta_description || excerpt || '',
      meta_keywords: meta_keywords || '',
      canonical_url: canonical_url || '',
      read_time_minutes: readTime
    });

    // Link attachments if provided
    if (Array.isArray(attachment_ids) && attachment_ids.length > 0) {
      await LampiranBerita.update(
        { berita_id: newArticle.id },
        { where: { id: { [Op.in]: attachment_ids } } }
      );
    }

    // Invalidate caches
    await deletePattern('berita:*');
    await deletePattern('seo:*');

    return res.status(201).json({
      success: true,
      message: 'Berita berhasil disimpan',
      data: newArticle
    });
  } catch (error) {
    logger.error(`Error createBerita: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Gagal membuat berita: ${error.message}` 
    });
  }
};

/**
 * Admin: Update Berita
 */
const updateBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Berita.findByPk(id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    const { 
      title, 
      slug, 
      excerpt, 
      content, 
      cover_image, 
      cover_caption, 
      kategori_id, 
      kategori_ids,
      status, 
      published_at, 
      is_featured, 
      is_pinned, 
      meta_title, 
      meta_description, 
      meta_keywords, 
      canonical_url,
      author_name 
    } = req.body;

    let updatedSlug = article.slug;
    if (slug && slug !== article.slug) {
      let candidateSlug = createSlug(slug);
      let count = 1;
      while (await Berita.findOne({ where: { slug: candidateSlug, id: { [Op.ne]: id } } })) {
        candidateSlug = `${createSlug(slug)}-${count++}`;
      }
      updatedSlug = candidateSlug;
    }

    const wordCount = (content || article.content).replace(/<[^>]*>?/gm, ' ').trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Handle multiple categories
    let updatedCategoryIds = article.kategori_ids;
    if (kategori_ids !== undefined) {
      if (Array.isArray(kategori_ids)) {
        updatedCategoryIds = kategori_ids.map(Number).filter(n => !isNaN(n));
      } else if (typeof kategori_ids === 'string') {
        try {
          const parsed = JSON.parse(kategori_ids);
          if (Array.isArray(parsed)) updatedCategoryIds = parsed.map(Number);
        } catch (_) {
          updatedCategoryIds = [parseInt(kategori_id || article.kategori_id, 10)];
        }
      }
    }

    await article.update({
      title: title !== undefined ? title : article.title,
      slug: updatedSlug,
      excerpt: excerpt !== undefined ? excerpt : article.excerpt,
      content: content !== undefined ? content : article.content,
      cover_image: cover_image !== undefined ? cover_image : article.cover_image,
      cover_caption: cover_caption !== undefined ? cover_caption : article.cover_caption,
      kategori_id: kategori_id !== undefined ? parseInt(kategori_id, 10) : article.kategori_id,
      kategori_ids: updatedCategoryIds,
      author_name: author_name !== undefined ? author_name : article.author_name,
      status: status !== undefined ? status : article.status,
      published_at: published_at ? new Date(published_at) : article.published_at,
      is_featured: is_featured !== undefined ? !!is_featured : article.is_featured,
      is_pinned: is_pinned !== undefined ? !!is_pinned : article.is_pinned,
      meta_title: meta_title !== undefined ? meta_title : article.meta_title,
      meta_description: meta_description !== undefined ? meta_description : article.meta_description,
      meta_keywords: meta_keywords !== undefined ? meta_keywords : article.meta_keywords,
      canonical_url: canonical_url !== undefined ? canonical_url : article.canonical_url,
      read_time_minutes: readTime
    });

    // Link attachments if provided
    if (Array.isArray(req.body.attachment_ids)) {
      // Clear old unselected attachments
      await LampiranBerita.update(
        { berita_id: null },
        { where: { berita_id: id } }
      );
      if (req.body.attachment_ids.length > 0) {
        await LampiranBerita.update(
          { berita_id: id },
          { where: { id: { [Op.in]: req.body.attachment_ids } } }
        );
      }
    }

    // Invalidate caches
    await deletePattern('berita:*');
    await deletePattern('seo:*');

    return res.json({
      success: true,
      message: 'Berita berhasil diperbarui',
      data: article
    });
  } catch (error) {
    logger.error(`Error updateBerita: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: `Gagal memperbarui berita: ${error.message}` 
    });
  }
};

/**
 * Admin: Delete Berita
 */
const deleteBerita = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Berita.findByPk(id);

    if (!article) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }

    await article.destroy();
    await deletePattern('berita:*');
    await deletePattern('seo:*');

    return res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) {
    logger.error(`Error deleteBerita: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Gagal menghapus berita' });
  }
};

/**
 * Admin: Bulk Action Berita (Delete, Change Status, Change Category, Pin/Featured)
 */
const bulkActionBerita = async (req, res) => {
  try {
    const { action, ids, data } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Pilih setidaknya satu berita untuk aksi massal' });
    }

    let affectedCount = 0;

    switch (action) {
      case 'delete':
        affectedCount = await Berita.destroy({
          where: { id: { [Op.in]: ids } }
        });
        break;

      case 'publish':
        [affectedCount] = await Berita.update(
          { status: 'PUBLISHED', published_at: new Date() },
          { where: { id: { [Op.in]: ids } } }
        );
        break;

      case 'draft':
        [affectedCount] = await Berita.update(
          { status: 'DRAFT' },
          { where: { id: { [Op.in]: ids } } }
        );
        break;

      case 'change_category':
        if (!data?.kategori_id) {
          return res.status(400).json({ success: false, message: 'ID Kategori tujuan diperlukan' });
        }
        [affectedCount] = await Berita.update(
          { kategori_id: parseInt(data.kategori_id, 10) },
          { where: { id: { [Op.in]: ids } } }
        );
        break;

      case 'toggle_featured':
        [affectedCount] = await Berita.update(
          { is_featured: !!data?.is_featured },
          { where: { id: { [Op.in]: ids } } }
        );
        break;

      case 'toggle_pinned':
        [affectedCount] = await Berita.update(
          { is_pinned: !!data?.is_pinned },
          { where: { id: { [Op.in]: ids } } }
        );
        break;

      default:
        return res.status(400).json({ success: false, message: `Aksi massal '${action}' tidak dikenali` });
    }

    await deletePattern('berita:*');
    await deletePattern('seo:*');

    return res.json({
      success: true,
      message: `Berhasil memproses aksi '${action}' untuk ${affectedCount} berita`,
      affectedCount
    });
  } catch (error) {
    logger.error(`Error bulkActionBerita: ${error.message}`);
    return res.status(500).json({ success: false, message: `Gagal memproses aksi massal: ${error.message}` });
  }
};

module.exports = {
  getBeritaList,
  getBeritaBySlug,
  getBeritaTrending,
  getKategoriBeritaList,
  getKategoriAdminList,
  createKategoriBerita,
  updateKategoriBerita,
  deleteKategoriBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
  bulkActionBerita,
  trackShareBerita,
  getBeritaShareAnalytics
};
