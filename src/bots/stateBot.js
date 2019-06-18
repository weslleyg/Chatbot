const { ActivityHandler } = require('botbuilder');

const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

class stateBot extends ActivityHandler {
	constructor(conversationState, userState) {
		super();

		this.conversationData = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
		this.userProfile = userState.createProperty(USER_PROFILE_PROPERTY);

		this.conversationState = conversationState;
		this.userState = userState;

		this.onMembersAdded(async (turnContext, next) => {
			for (let idx in turnContext.activity.membersAdded) {
				if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
					await turnContext.sendActivity('Olá usuario, seja bem vindo!');
				}
			}

			await next();
		});

		this.onMessage(async (turnContext, next) => {
			const userProfile = await this.userProfile.get(turnContext, {});
			const conversationData = await this.conversationData.get(turnContext, { promptedForUserName: false });

			if (!userProfile.name) {
				if (conversationData.promptedForUserName) {
					userProfile.name = turnContext.activity.text;

					await turnContext.sendActivity(`Obrigado ${userProfile.name}`);

					conversationData.promptedForUserName = false;
				} else {
					await turnContext.sendActivity('Qual seu nome?');

					conversationData.promptedForUserName = true;
				}
			} else {
				conversationData.timestamp = turnContext.activity.timestamp.toLocaleString();
				conversationData.channelId = turnContext.activity.channelId;

				await turnContext.sendActivity(`${userProfile.name} enviou: ${turnContext.activity.text}`);
				await turnContext.sendActivity(`Mensagem recebida às: ${conversationData.timestamp}`);
				await turnContext.sendActivity(`Mensagem recebida do: ${conversationData.channelId}`);
			}

			await next();
		});

		this.onDialog(async (turnContext, next) => {
			await this.conversationState.saveChanges(turnContext, false);
			await this.userState.saveChanges(turnContext, false);

			await next();
		});
	}
}

module.exports.stateBot = stateBot;
