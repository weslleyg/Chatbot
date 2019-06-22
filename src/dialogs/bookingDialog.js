const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');
const { ConfirmPrompt, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { DateResolverDialog } = require('./dateResolverDialog');

const CONFIRM_PROMPT = 'confirmPrompt';
const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class BookingDialog extends CancelAndHelpDialog {
	constructor(id) {
		super(id || 'bookingDialog');

		this.addDialog(new TextPrompt(TEXT_PROMPT))
			.addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
			.addDialog(new DateResolverDialog(DATE_RESOLVER_DIALOG))
			.addDialog(
				new WaterfallDialog(WATERFALL_DIALOG, [
					this.destinationStep.bind(this),
					this.originStep.bind(this),
					this.travelDateStep.bind(this),
					this.confirmStep.bind(this),
					this.finalStep.bind(this)
				])
			);

		this.initialDialogId = WATERFALL_DIALOG;
	}

	async destinationStep(step) {
		const bookingDetails = step.options;

		if (!bookingDetails.destination) {
			return await step.prompt(TEXT_PROMPT, { prompt: 'Para qual city?' });
		} else {
			return await step.next(bookingDetails.destination);
		}
	}

	async originStep(step) {
		const bookingDetails = step.options;

		bookingDetails.destination = step.result;

		if (!bookingDetails.origin) {
			return await step.prompt(TEXT_PROMPT, { prompt: 'De qual city?' });
		} else {
			return await step.next(bookingDetails.origin);
		}
	}

	async travelDateStep(step) {
		const bookingDetails = step.options;

		bookingDetails.origin = step.result;

		if (!bookingDetails.travelDate || this.isAmbiguous(bookingDetails.travelDate)) {
			return await step.beginDialog(DATE_RESOLVER_DIALOG, { date: bookingDetails.travelDate });
		} else {
			return await step.next(bookingDetails.travelDate);
		}
	}

	async confirmStep(step) {
		const bookingDetails = step.options;

		bookingDetails.travelDate = step.result.timex;

		console.log(bookingDetails);
		const msg = `Confirme, você quer viajar de ${bookingDetails.destination} para: ${bookingDetails.origin} em: ${bookingDetails.travelDate}.`;

		return await step.prompt(CONFIRM_PROMPT, { prompt: msg });
	}

	async finalStep(step) {
		if (step.result === true) {
			const bookingDetails = step.options;

			return await step.endDialog(bookingDetails);
		} else {
			return await step.endDialog();
		}
	}

	isAmbiguous(timex) {
		const timexProperty = new TimexProperty(timex);
		return !timexProperty.types.has('definite');
	}
}

module.exports.BookingDialog = BookingDialog;
