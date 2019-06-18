const { ComponentDialog, DialogSet, TextPrompt, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {
	constructor(logger) {
		super('MainDialog');

		if (!logger) {
			logger = console;
			logger.log('[MainDialog]: logger não esta setado, console sera setado como default');
		}

		this.logger = logger;

		this.addDialog(new TextPrompt('TextPrompt')).addDialog(
			new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
				this.introStep.bind(this),
				this.actStep.bind(this),
				this.finalStep.bind(this)
			])
		);

		this.initialDialogId = MAIN_WATERFALL_DIALOG;
	}

	async run(context, accessor) {
		const dialogSet = new DialogSet(accessor);
		dialogSet.add(this);

		const dialogContext = await dialogSet.createContext(context);
		const results = await dialogContext.continueDialog();

		if (results.status === DialogTurnStatus.empty) {
			await dialogContext.beginDialog(this.id);
		}
	}

	async introStep(step) {
		return await step.prompt('TextPrompt', { prompt: 'Qual seu nome?' });
	}

	async actStep(step) {
		return await step.prompt('TextPrompt', { prompt: `Prazer em conhecer-te ${step.context.activity.text}` });
	}

	async finalStep(step) {
		await step.context.sendActivity('Obrigado!');

		return await step.endDialog();
	}
}

module.exports.MainDialog = MainDialog;
