const mysql = require('mysql2/promise');
const mongoose = require('mongoose');

// Configuration MySQL
const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!mysqlConfig.host || !mysqlConfig.user || !mysqlConfig.password || !mysqlConfig.database || !MONGODB_URI) {
    throw new Error('Missing MYSQL_* or MONGODB_URI environment variables');
}

// Définir les schémas MongoDB
const UserSchema = new mongoose.Schema({
    id: Number,
    username: String,
    password: String,
    first_name: String,
    last_name: String,
    email: String,
    phone: String,
    role: String,
    created_at: Date,
    updated_at: Date
});

const MessageSchema = new mongoose.Schema({
    id: Number,
    firstname: String,
    lastname: String,
    email: String,
    telephone: String,
    objet: String,
    message: String,
    date: Date,
    state: String
});

const EventSchema = new mongoose.Schema({
    id: Number,
    title: String,
    start: Date,
    end: Date,
    category: String,
    location: String,
    leader: String,
    audience: String,
    notes: String,
    allDay: Boolean,
    browserId: String,
    createdAt: Date,
    updatedAt: Date
});

const AnnouncementSchema = new mongoose.Schema({
    id: Number,
    author: String,
    title_fr: String,
    title_en: String,
    content_fr: String,
    content_en: String,
    date: Date,
    is_active: Boolean,
    created_at: Date
});

// Créer les modèles
const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);
const Event = mongoose.model('Event', EventSchema);
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

async function migrateUsers(mysqlConn) {
    console.log('📦 Migration des utilisateurs...');
    try {
        const [users] = await mysqlConn.query('SELECT * FROM users');
        console.log(`   Trouvé ${users.length} utilisateurs dans MySQL`);

        for (const user of users) {
            try {
                const existing = await User.findOne({ username: user.username });
                if (!existing) {
                    await User.create({
                        id: user.id,
                        username: user.username,
                        password: user.password,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        phone: user.phone,
                        role: user.role || 'viewer',
                        created_at: user.created_at || new Date(),
                        updated_at: user.updated_at || new Date()
                    });
                    console.log(`  ✅ Utilisateur ${user.username} (ID: ${user.id}) migré`);
                } else {
                    console.log(`  ⏭️  Utilisateur ${user.username} existe déjà`);
                }
            } catch (error) {
                console.error(`  ❌ Erreur pour ${user.username}:`, error.message);
            }
        }
    } catch (error) {
        console.error('  ❌ Erreur requête MySQL:', error.message);
    }
}

async function migrateMessages(mysqlConn) {
    console.log('\n📦 Migration des messages...');
    try {
        const [messages] = await mysqlConn.query('SELECT * FROM messages');
        console.log(`   Trouvé ${messages.length} messages dans MySQL`);

        for (const msg of messages) {
            try {
                const existing = await Message.findOne({ id: msg.id });
                if (!existing) {
                    await Message.create({
                        id: msg.id,
                        firstname: msg.firstname,
                        lastname: msg.lastname,
                        email: msg.email,
                        telephone: msg.telephone,
                        objet: msg.objet,
                        message: msg.message,
                        date: msg.date || new Date(),
                        state: msg.state || 'no-read'
                    });
                    console.log(`  ✅ Message ${msg.id} migré`);
                } else {
                    console.log(`  ⏭️  Message ${msg.id} existe déjà`);
                }
            } catch (error) {
                console.error(`  ❌ Erreur message ${msg.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('  ❌ Erreur requête MySQL:', error.message);
    }
}

async function migrateEvents(mysqlConn) {
    console.log('\n📦 Migration des événements...');
    try {
        const [events] = await mysqlConn.query('SELECT * FROM events');
        console.log(`   Trouvé ${events.length} événements dans MySQL`);

        for (const event of events) {
            try {
                const existing = await Event.findOne({ id: event.id });
                if (!existing) {
                    await Event.create({
                        id: event.id,
                        title: event.title,
                        start: event.start,
                        end: event.end,
                        category: event.category,
                        location: event.location,
                        leader: event.leader,
                        audience: event.audience,
                        notes: event.notes,
                        allDay: event.allDay === 1,
                        browserId: event.browserId,
                        createdAt: event.createdAt || new Date(),
                        updatedAt: event.updatedAt || new Date()
                    });
                    console.log(`  ✅ Événement ${event.id} migré`);
                } else {
                    console.log(`  ⏭️  Événement ${event.id} existe déjà`);
                }
            } catch (error) {
                console.error(`  ❌ Erreur événement ${event.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('  ❌ Erreur requête MySQL:', error.message);
    }
}

async function migrateAnnouncements(mysqlConn) {
    console.log('\n📦 Migration des annonces...');
    try {
        const [announcements] = await mysqlConn.query('SELECT * FROM announcements');
        console.log(`   Trouvé ${announcements.length} annonces dans MySQL`);

        for (const ann of announcements) {
            try {
                const existing = await Announcement.findOne({ id: ann.id });
                if (!existing) {
                    await Announcement.create({
                        id: ann.id,
                        author: ann.author,
                        title_fr: ann.title_fr,
                        title_en: ann.title_en,
                        content_fr: ann.content_fr,
                        content_en: ann.content_en,
                        date: ann.date,
                        is_active: ann.is_active === 1,
                        created_at: ann.created_at || new Date()
                    });
                    console.log(`  ✅ Annonce ${ann.id} migrée`);
                } else {
                    console.log(`  ⏭️  Annonce ${ann.id} existe déjà`);
                }
            } catch (error) {
                console.error(`  ❌ Erreur annonce ${ann.id}:`, error.message);
            }
        }
    } catch (error) {
        console.error('  ❌ Erreur requête MySQL:', error.message);
    }
}

async function main() {
    console.log('🚀 DÉBUT DE LA MIGRATION MYSQL → MONGODB\n');

    let mysqlConn = null;

    try {
        // Connexion MySQL
        console.log('Connexion à MySQL...');
        mysqlConn = await mysql.createConnection(mysqlConfig);
        console.log('✅ Connecté à MySQL');

        // Connexion MongoDB
        console.log('\nConnexion à MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB\n');

        // Exécuter les migrations
        await migrateUsers(mysqlConn);
        await migrateMessages(mysqlConn);
        await migrateEvents(mysqlConn);
        await migrateAnnouncements(mysqlConn);

        console.log('\n🎉 MIGRATION TERMINÉE AVEC SUCCÈS !');

        // Afficher les compteurs
        const userCount = await User.countDocuments();
        const messageCount = await Message.countDocuments();
        const eventCount = await Event.countDocuments();
        const announcementCount = await Announcement.countDocuments();

        console.log('\n📊 Récapitulatif dans MongoDB:');
        console.log(`   - Utilisateurs: ${userCount}`);
        console.log(`   - Messages: ${messageCount}`);
        console.log(`   - Événements: ${eventCount}`);
        console.log(`   - Annonces: ${announcementCount}`);

    } catch (error) {
        console.error('\n❌ ERREUR FATALE:', error);
    } finally {
        if (mysqlConn) await mysqlConn.end();
        await mongoose.disconnect();
        console.log('\n🔌 Connexions fermées');
    }
}

main();
