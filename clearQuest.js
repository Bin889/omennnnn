const axios = require('axios');
const chalk = require('chalk');

const url = 'https://api.omen.farmroll.io/v1/quests/user';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ur bearer'
};

// Fungsi untuk memverifikasi quest
const verifyQuest = async (quest) => {
    let questType = quest.type;
    if (questType === 'like-repost') {
        questType = 'like-retweet';
    }

    const verifyUrl = `https://api.omen.farmroll.io/v1/quests/verify-${questType}/${quest.id}`;

    try {
        const response = await axios.post(verifyUrl, {}, { headers: headers });
        console.log(chalk.greenBright(`Quest ID: ${quest.id} verified.\nTotal Points: ${response.data.totalPoints}\n`));
    } catch (error) {
        console.error(`Error verifying quest ID: ${quest.id}`, error);
    }
};

// Fungsi untuk menambahkan delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mendapatkan dan memproses quest
axios.get(url, { headers: headers })
    .then(async response => {
        const quests = response.data;
        const filteredQuests = quests.filter(quest => !quest.isCompleted && quest.type !== 'change-name');

        for (const quest of filteredQuests) {
            console.log(chalk.yellowBright(`Verifying Quest ID: ${quest.id}...\nType: ${quest.type}\nReward: ${quest.pointsAward} Points\n`));
            await verifyQuest(quest);
            await delay(1000); // Penundaan 1 detik
        }
    })
    .catch(error => {
        console.error('Error making GET request:', error);
    });
