const restify = require('restify');
const path = require('path');

const { BotFrameworkAdapter } = require('botbuilder');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const adapter = new BotFrameworkAdapter({
	appId: process.env.MicrosoftAppId,
	appPassword: process.env.MicrosoftAppPassword
});

adapter.onTurnError = async (context, error) => {
	console.error(`\n [onTurnError]: ${error}`);

	await context.sendActivity(`Oops... Algo deu errado!`);
};

const { dialogBot } = require('./bots/dialogBot');

const bot = new dialogBot();

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log(`\n Servidor ${server.name} on na porta ${server.url}.`);
});

server.post('/api/messages', (req, res) => {
	adapter.processActivity(req, res, async (turnContext) => {
		await bot.run(turnContext);
	});
});
