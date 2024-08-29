const randomstring = require('randomstring');

const User = require('../models/user.model');

module.exports = seedAdmin = async () => {
    const isAdmin = await User.findOne({ role: 1 });

    let user = 'auth@admin.com';
    let pass = randomstring.generate({
        length: 10,
        charset: ['alphanumeric', '!'],
    })

    if (isAdmin) {
        isAdmin.password = pass;
        await isAdmin.save();
    }
    else {
        let admin = {
            name: 'Admin',
            phone: null,
            email: user,
            password: pass,
            role: 1
        }

        await new User(admin).save();
    }
    return console.log('\x1b[32m','✔',`Admin seeding completed.${'\x1b[0m'}
    ---------------------------------
    user: ${user}
    pass: ${pass}
    -----------------------------------`)
}

// seedAdmin().then((credential) => {
//     console.log("Admin seeding completed");
//     console.log(credential)
// }).catch((err) => {
//     console.error("Error seeding admin:", err);
//     process.exit(1);
// }).finally(() => {
//     mongoose.disconnect();
//     console.log('disconnected.')
//     process.exit(0);
// });