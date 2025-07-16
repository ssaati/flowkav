import englishMessages from 'ra-language-english';

export const messages = {
    simple: {
        action: {
            close: 'بستن',
            resetViews: 'Reset views',
        },
        'create-post': 'New post',
    },
    ...englishMessages,
    resources: {
        users: {
            name: 'کاربر |||| کاربران',
            fields: {
                name: 'نام',
                role: 'نقش',
            },
            notifications: {
                created: 'User created |||| %{smart_count} users created',
                updated: 'User updated |||| %{smart_count} users updated',
                deleted: 'User deleted |||| %{smart_count} users deleted',
            },
        },
    },
    form: {
        fields: {
            name: 'نام',
            title: 'عنوان',
            steps: 'مراحل تایید'
        },
        list: {
            search: 'جستجو',
        },
        form: {
            name: 'نام',
        },
        edit: {
            title: 'فرم "%{title}"',
        },
        action: {
            save_and_edit: 'ذخیره و ویرایش',
            save_and_add: 'ذخیره و اضافه',
            save_and_show: 'ذخیره و نمایش',
        },
    },
    user: {
        list: {
            search: 'جستجو',
        },
        form: {
            summary: 'خلاصه',
            security: 'امنیت',
        },
        action: {
            save_and_add: 'ذخیره و اضافه',
            save_and_show: 'ذخیره و نمایش',
        },
    },
};

export default messages;
