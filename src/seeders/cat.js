const Cat = require('../models/cat.model');

module.exports = seedCat = async () => {
    const isCat = await Cat.findOne({ name: 'uncategorize' });
    if (!isCat) {
        await new Cat({
            name: 'uncategorize',
            desc: 'default category'
        }).save();
    };

    return console.log('\x1b[32m','✔',"Category seeding completed", '\x1b[0m');
}

