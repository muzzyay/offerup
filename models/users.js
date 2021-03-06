var bcrypt = require("bcrypt-nodejs");

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2],
        // isAlpha: true,
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: {
        args: true,
        msg: 'Email address already in use!'
      }
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {

        len:{
          args: [6, 16],
          msg: 'Password should be between 6-16 characters.'
        } 
      }
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
      validate: {
          isUrl: true,
      }
  },

  });

  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.addHook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  User.associate = function (models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    User.hasMany(models.Item, {
      onDelete: "cascade"
    });
  };
  return User;
};
