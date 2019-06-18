const { ActivityHandler } = require('botbuilder');

class DialogBot extends ActivityHandler {
	constructor(conversationState, userState, dialog, logger) {
		super();
		if (!conversationState)
			throw new Error('[DialogBot]: Parâmetro não encontrado. conversationState é requerido!');
		if (!userState) throw new Error('[DialogBot]: Parâmetro não encontrado. userState é requerido!');
		if (!dialog) throw new Error('[DialogBot]: Parâmetro não encontrado. dialog é requerido!');
		if (!logger) {
			logger = console;
			logger.log('[DialogBot]: logger não esta setado, console sera setado como default');
		}

		this.conversationState = conversationState;
		this.userState = userState;
		this.dialog = dialog;
		this.logger = logger;
		this.dialogState = this.conversationState.createProperty('DialogState');

		this.onMessage(async (context, next) => {
			this.logger.log('Dialogo rolando com Message Activity');

            await this.dialog.run(context, this.dialogState);

			await next();
		});

		this.onDialog(async (context, next) => {
			await this.conversationState.saveChanges(context, false);
			await this.userState.saveChanges(context, false);

			await next();
		});
	}
}

module.exports.DialogBot = DialogBot;
