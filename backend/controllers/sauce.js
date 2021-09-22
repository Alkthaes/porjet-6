const Sauce = require('../models/Sauce');
const fs = require('fs');
const { error } = require('console');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.likes = 0;
    sauce.dislikes = 0;
    usersLike = [];
    usersDislike = [];
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a bien été ajoutée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modifyLikes = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (req.body.like === 1) {
                if (sauce.usersLike.find(req.body.userId)) {
                    return error({ error })
                } else {
                    sauce.usersLike.push(req.body.userId);
                    sauce.likes += 1;
                };
            }
            else if (req.body.like === -1) {
                if (sauce.usersDislike.find(req.body.userId)) {
                    return error({ error })
                } else {
                    sauce.usersDislike.push(req.body.userId);
                    sauce.dislikes += 1;
                };
            }
            else if (req.body.like === 0) {
                if (sauce.usersLike.find(req.body.userId)) {
                    const index = sauce.usersLike.indexOf(req.body.userId);
                    if (index < -1) {
                        sauce.usersLike.splice(index, 1);
                    }
                }
                else if (sauce.usersDislike.find(req.body.userId)) {
                    const index = sauce.usersDislike.indexOf(req.body.userId);
                    if (index < -1) {
                        sauce.usersDislike.splice(index, 1);
                    }
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json({ sauce }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json({ sauce }))
        .catch(error => res.status(400).json({ error }));
};