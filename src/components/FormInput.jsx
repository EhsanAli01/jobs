import React from 'react';

const FormInput = ({ id, type, formik, name, placeholder = '' }) => {

    const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);
    const insertSpaces = (string) => string.replace(/([A-Z])/g, ' $1').trim();
    const formattedLabel = capitalizeFirstLetter(insertSpaces(name));

    return (
        <div className='w-full'>
            <label htmlFor={id} className=' w-full font-semibold'>{formattedLabel}</label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                className='border border-gray-500 px-3 w-full py-1 rounded-md bg-gray-100 outline-none'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values[name]}
            />
            {formik.touched[name] && formik.errors[name] && <div className="my-1 w-full text-red-600">{formik.errors[name]}</div>}
        </div>
    );
}

export default FormInput;