const { ActivityHandler, CardFactory, ActionTypes, MessageFactory } = require('botbuilder');

class dialogBot extends ActivityHandler {
	constructor() {
		super();

		this.onMessage(async (context) => {
			switch (context.activity.text) {
				case '!help':
					await this.cardTeste(context);
					break;
				case '!comandos':
					await this.comandoTeste(context);
					break;
				case '!github':
					await context.sendActivity('https://github.com/weslleyg');
					break;
				default:
					await context.sendActivity('!comandos para ver os comandos');
			}
		});

		this.onMembersAdded(async (context, next) => {
			for (let idx in context.activity.membersAdded) {
				if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
					await context.sendActivity(`Bem vindo ${context.activity.from.name}`);
					await context.sendActivity(`Se tiver alguma duvida digite o comando !help.`);
				}
			}

			await next();
		});
	}

	async cardTeste(context) {
		const card = CardFactory.heroCard(
			'Está com alguma duvida?',
			'Acesse os links para mais detalhes do framework',
			[ 'https://aka.ms/bf-welcome-card-image' ],
			[
				{
					type: ActionTypes.OpenUrl,
					title: 'Documentação',
					value: 'https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0'
				},
				{
					type: ActionTypes.OpenUrl,
					title: 'Faça uma pergunta',
					value: 'https://stackoverflow.com/questions/tagged/botframework'
				},
				{
					type: ActionTypes.OpenUrl,
					title: 'Publicar bot',
					value:
						'https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-deploy-azure?view=azure-bot-service-4.0'
				}
			]
		);

		await context.sendActivity({ attachments: [ card ] });
	}

	async comandoTeste(context) {
		const reply = MessageFactory.suggestedActions([ '!help', '!comandos', '!github' ]);

		await context.sendActivity(reply);
	}
}

module.exports.dialogBot = dialogBot;
