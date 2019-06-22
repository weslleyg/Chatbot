const { DateTimePrompt, WaterfallDialog } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { TimexProperty } = require('@microsoft/recognizers-text-data-types-timex-expression');

const DATETIME_PROMPT = 'datetimePrompt';
const WATERFALL_DIALOG = 'waterfallDialog';

class DateResolverDialog extends CancelAndHelpDialog {
	constructor(id) {
		super(id || 'dateResolverDialog');

		this.addDialog(new DateTimePrompt(DATETIME_PROMPT, this.dateTimePromptValidator.bind(this))).addDialog(
			new WaterfallDialog(WATERFALL_DIALOG, [ this.initialStep.bind(this), this.finalStep.bind(this) ])
		);

		this.initialDialogId = WATERFALL_DIALOG;
	}

	async initialStep(step) {
		const timex = step.options.date;

		const promptMsg = 'Em qual data você gostaria de viajar?';
		const repromtpMsg = 'Desculpe, para melhores resultados, entre com a data da viajem com mês, dia e ano!';

		if (!timex) {
			return await step.prompt(DATETIME_PROMPT, {
				prompt: promptMsg,
				retryPrompt: repromtpMsg
			});
		} else {
			const timexProperty = new TimexProperty(timex);

			if (!timexProperty.types.has('definite')) {
				return await step.prompt(DATETIME_PROMPT, { prompt: repromtpMsg });
			} else {
				return await step.next({ timex: timex });
			}
		}
	}

	async finalStep(step) {
		const timex = step.result[0].timex;
		return await step.next({ timex: timex });
	}

	async dateTimePromptValidator(promptContext) {
		if (promptContext.recognized.succeeded) {
			const timex = promptContext.recognized.value[0].timex.split('T')[0];

			return new TimexProperty(timex).types.has('definite');
		} else {
			return false;
		}
	}
}

module.exports.DateResolverDialog = DateResolverDialog;
