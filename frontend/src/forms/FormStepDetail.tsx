import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormStepDetail = () => {
    const { setValue, getValues } = useFormContext();
    const details = getValues('steps') || [];

    const addDetail = () => {
        const updated = [...details, { name: '', value: '' }];
        setValue('steps', updated);
    };

    return (
        <div>
            {details.map((detail, index) => (
                <div key={index}>
                    <input
                        value={detail.name}
                        onChange={e => {
                            const updated = [...details];
                            updated[index].name = e.target.value;
                            setValue('steps', updated);
                        }}
                    />
                    <input
                        value={detail.value}
                        onChange={e => {
                            const updated = [...details];
                            updated[index].value = e.target.value;
                            setValue('steps', updated);
                        }}
                    />
                </div>
            ))}
            <button type="button" onClick={addDetail}>Add Detail</button>
        </div>
    );
};
export default FormStepDetail;