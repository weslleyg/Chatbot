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
			.addDialog(new WaterfallDialog(WATERFALL_DIALOG, []));

		this.initialDialogId = WATERFALL_DIALOG;
	}
}

module.exports.BookingDialog = BookingDialog;
