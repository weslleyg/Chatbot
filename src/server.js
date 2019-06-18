const restify = require('restify');
const path = require('path');

const { BotFrameworkAdapter, MemoryStorage, ConversationState, UserState } = require('botbuilder');

const { welcomeBot } = require('./bots/welcomeBot');
const { MainDialog } = require('./dialogs/mainDialog');

const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
	console.log(`\n Servidor ${server.name} on na porta ${server.url}.`);
});

const adapter = new BotFrameworkAdapter({
	appId: process.env.MicrosoftAppId,
	appPassword: process.env.MicrosoftAppPassword
});

const memoryStorage = new MemoryStorage();

const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

const logger = console;

const dialog = new MainDialog(logger);
const bot = new welcomeBot(conversationState, userState, dialog, logger);

adapter.onTurnError = async (context, error) => {
	console.error(`\n [onTurnError]: ${error}`);

	await context.sendActivity(`Oops... Algo deu errado!`);

	await conversationState.load(context);
	await conversationState.clear(context);

	await conversationState.saveChanges(context);
};

server.post('/api/messages', (req, res) => {
	adapter.processActivity(req, res, async (turnContext) => {
		await bot.run(turnContext);
	});
});
