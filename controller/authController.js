const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connect');

exports.register = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  if (!username || !password)
    return res.status(400).send('Missing required fields');

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword],
    (err) => {
      if (err) return res.status(500).send(err.message);

      res.send('User registered successfully');
    }
  );
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send('Missing required fields');

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).send(err.message);

    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    res.json({ auth: true, token });
  });
};
