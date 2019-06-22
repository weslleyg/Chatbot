const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ComponentDialog, DialogSet, TextPrompt, DialogTurnStatus, WaterfallDialog } = require('botbuilder-dialogs');
const { BookingDialog } = require('./bookingDialog');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';
const BOOKING_DIALOG = 'bookingDialog';

class MainDialog extends ComponentDialog {
	constructor(logger) {
		super('MainDialog');

		if (!logger) {
			logger = console;
			logger.log('[MainDialog]: logger não esta setado, console sera setado como default');
		}

		this.logger = logger;

		this.addDialog(new TextPrompt('TextPrompt'))
			.addDialog(new BookingDialog(BOOKING_DIALOG))
			.addDialog(
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
		let bookingDetails = {};

		return await step.beginDialog('bookingDialog', bookingDetails);
	}

	async finalStep(step) {
		if (step.result) {
			const result = step.result;

			const timeProperty = new TimexProperty(result.travelDate);
			const travelDateMsg = timeProperty.toNaturalLanguage(new Date(Date.now()));
			const msg = `I have you booked to ${result.destination} from ${result.origin} on ${travelDateMsg}.`;

			await step.context.sendActivity(msg);
		} else {
			await step.context.sendActivity('Thank you');
		}

		return await step.endDialog();
	}
}

module.exports.MainDialog = MainDialog;
