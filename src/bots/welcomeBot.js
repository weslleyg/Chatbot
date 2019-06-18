const { DialogBot } = require('./dialogBot');
const { CardFactory } = require('botbuilder');
const WelcomeCard = require('../resources/welcomeCard.json');

class welcomeBot extends DialogBot {
	constructor(conversationState, userState, dialog, logger) {
		super(conversationState, userState, dialog, logger);

		this.onMembersAdded(async (context, next) => {
			for (let idx in context.activity.membersAdded) {
				if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
					const welcomeCard = CardFactory.adaptiveCard(WelcomeCard);
					await context.sendActivity({ attachments: [ welcomeCard ] });
				}
			}

			await next();
		});
	}
}

module.exports.welcomeBot = welcomeBot;
