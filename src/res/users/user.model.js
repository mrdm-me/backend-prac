const mongoose =require( 'mongoose')
const bcrypt =require( 'bcrypt')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },
    settings: {
      theme: {
        type: String,
        required: true,
        default: 'dark'
      },
      notifications: {
        type: Boolean,
        required: true,
        default: true
      },
      compactMode: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function(next) {
  if (!isModified('password')) {
    return next()
  }

  bcrypt.hash(password, 8, (err, hash) => {
    if (err) {
      return next(err)
    }

    password = hash
    next()
  })
})

userSchema.methods.checkPassword = function(password) {
  const passwordHash = password

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, same) => {
      if (err) {
        return reject(err)
      }

      resolve(same)
    })
  })
}

const User = mongoose.model('user', userSchema)
module.exports={User}