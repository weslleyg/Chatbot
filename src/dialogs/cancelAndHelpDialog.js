const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');
const { CardFactory, ActionTypes } = require('botbuilder');

class CancelAndHelpDialog extends ComponentDialog {
	async onBeginDialog(innerDc, options) {
		const result = await this.interrupt(innerDc);
		if (result) {
			return result;
		}
		return await super.onBeginDialog(innerDc, options);
	}

	async onContinueDialog(innerDc) {
		const result = await this.interrupt(innerDc);
		if (result) {
			return result;
		}
		return await super.onContinueDialog(innerDc);
	}

	async interrupt(innerDc) {
		const text = innerDc.context.activity.text.toLowerCase();

		switch (text) {
			case 'ajuda':
			case '?':
				await this.cardHelp(innerDc.context);
				return { status: DialogTurnStatus.waiting };
			case 'cancelar':
			case 'sair':
				await innerDc.context.sendActivity('Cancelando');
				return await innerDc.cancelAllDialogs();
			case 'git':
				await innerDc.context.sendActivity('https://github.com/weslleyg');
				return { status: DialogTurnStatus.waiting };
		}
	}

	async cardHelp(context) {
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
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
