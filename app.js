const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/user');
const User = require('./Models/User');

mongoose.connect('mongodb+srv://Cod3Lif3:aZERTYUIOP_973@cluster0.whwmt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));
app.use((req,res) =>{
    res.json({ message : 'Votre requête a bien été reçue !'});
});

app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const user = new User({
      ...req.body
    });
    thing.save()
      .then(() => res.status(201).json({ message: 'User enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  });

app.use('/api/auth', userRoutes);

module.exports = app;