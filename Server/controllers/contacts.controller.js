const Contact = require('../Models/contact.model');
const mongoose = require('mongoose');

exports.createContact = async (req, res) => {
  try {
    const userId = req.user.id;
    let { firstName, lastName, phone } = req.body;
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'prénom, nom et téléphone sont requis' });
    }

    phone = String(phone).replace(/\s+/g, '');

    const created = await Contact.create({ userId, firstName, lastName, phone });
    return res.status(201).json(created);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Ce numéro est déjà utilisé' });
    }
    console.error(e);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { q, page = 1, limit = 20, sort = 'lastName:asc' } = req.query;

    const filters = { userId: new mongoose.Types.ObjectId(userId) };

    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      filters.$or = [{ firstName: regex }, { lastName: regex }, { phone: regex }];
    }

    const [sortField, sortDir] = String(sort).split(':');
    const sortObj = { [sortField || 'lastName']: sortDir === 'desc' ? -1 : 1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Contact.find(filters).sort(sortObj).skip(skip).limit(Number(limit)).lean(),
      Contact.countDocuments(filters),
    ]);

    res.json({
      items,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const contact = await Contact.findOne({ _id: id, userId }).lean();
    if (!contact) return res.status(404).json({ message: 'Contact introuvable' });

    res.json(contact);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { firstName, lastName, phone } = req.body;

    const contact = await Contact.findOne({ _id: id, userId });
    if (!contact) return res.status(404).json({ message: 'Contact introuvable' });

    if (firstName !== undefined) contact.firstName = firstName;
    if (lastName !== undefined)  contact.lastName  = lastName;
    if (phone !== undefined)     contact.phone     = String(phone).replace(/\s+/g, '');

    await contact.save();
    res.json(contact);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Ce numéro est déjà utilisé' });
    }
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Contact.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Contact introuvable' });

    res.json({ message: 'Contact supprimé' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
