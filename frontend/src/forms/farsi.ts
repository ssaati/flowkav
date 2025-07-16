import {editorLocalization, getLocaleStrings} from "survey-creator-core";
import {surveyLocalization} from "survey-core";

export const makeFarsi= (creator: any) =>{
    creator.locale = 'fa';
    creator.isRTL = true;
    // creator.surveyLocalization.locales["en"].otherItemText = "Alpha";
    const localeStrings = getLocaleStrings('fa');
    replaceTranslations(localeStrings)

    creator.onQuestionAdded.add((_: any, options:any) => {
        if (options.reason === "ELEMENT_CONVERTED")
            return;

        const q = options.question;
        console.log(q.getType())
        if(q.getType() === 'boolean'){
            q.labelTrue='بله';
            q.labelFalse='خیر';
        }
        if(q.getType() === 'dropdown') {
            q.placeholder = 'انتخاب کنید...'
        }
        if(q.getType() === 'radiogroup' || q.getType() === 'dropdown' || q.getType() === 'checkbox' ) {
            q.selectAllText = 'انتخاب همه'
            q.otherText = 'دیگر (توضیح دهید)'
            q.noneText = 'هیچکدام'
            q.choices=[];
        }
        if(q.getType() === 'file' || q.getType() === 'image') {
            q.fileOrPhotoPlaceholder = "فایل را اینجا بیاندازید یا با استفاده از دوربین عکس بگیرید";
            q.filePlaceholder = "فایل را اینجا بیاندازید یا از دکمه زیر انتخاب کنید";
            q.photoPlaceholder = "این دکمه را بزنید تا با استفاده از دوربین عکس بگیرید";
            q.storeDataAsText = false;
        }
        q.emptyMessage='داده ای وجود ندارد'
    });

}

const replaceTranslations = (obj) => {
    replaceRecursive(obj);
    obj.selectAllText = "انتخاب همه"; // Change "Select All"
    obj.otherText = "دیگر (توضیح دهید)"; // Change "Other (describe)"    const creatorFarsiLocale = editorLocalization.;
    obj.survey.item = "مورد"; // Generic translation for "item"
    obj.p.selectAllText = "انتخاب همه";
    obj.p.otherText = "دیگر (توضیح دهید)";
    obj.p.fileChooseText = "انتخاب فایل";
};

function replaceRecursive(obj) {
    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === "string") {
            // console.log(obj[key]);
            obj[key] = obj[key].replace(/نظرسنجی/g, "فرم");
            obj[key] = obj[key].replace(/سوال/g, "فیلد");
            obj[key] = obj[key].replace(/دولت/g, "وضعیت");
            obj[key] = obj[key].replace(/فروپاشی/g, "جمع شدن");
            obj[key] = obj[key].replace(/فیلدات/g, "فیلدها");
        } else if (typeof obj[key] === "object") {
            replaceRecursive(obj[key]); // Recursively process nested objects
        }
    });
}

