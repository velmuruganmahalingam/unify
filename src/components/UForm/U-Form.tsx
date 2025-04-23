import React, { useState, useEffect, useRef } from 'react';

// Remove unused Plugin interface as it's not being used in this component
interface Plugin {
    id: string;
    name: string;
    description?: string;
    section: 'header' | 'sidebar' | 'content' | 'footer';
    component: React.ComponentType<any>;
    config?: Record<string, any>;
}

// Basic input field types
type BaseFieldType = 'text' | 'number' | 'email' | 'password' | 'date' | 'textarea' | 
    'tel' | 'url' | 'search' | 'file' | 'time' | 'datetime-local' | 'color' | 'range';

/**
 * Types for fields that support multiple options (select, radio, checkbox).
 */
type SelectFieldType = 'select' | 'radio' | 'checkbox';

/**
 * Base configuration for standard input fields.
 * @property name - Unique identifier for the field
 * @property label - Display label for the field
 * @property type - Input type from BaseFieldType
 * @property defaultValue - Optional initial value for the field
 */
type BaseField = {
    name: string;
    label: string;
    type: BaseFieldType;
    defaultValue?: string | number;
};

/**
 * Configuration for fields that support multiple options.
 * @property options - Array of available options
 * @property multiple - Whether multiple selections are allowed (for checkbox/select)
 * @property groupType - Determines if options should be grouped
 */
type OptionsField = {
    name: string;
    label: string;
    type: SelectFieldType;
    options: string[];
    multiple?: boolean;
    defaultValue?: string | string[];
    groupType?: 'single' | 'group';
};

/**
 * Structure for date range values containing start and end dates.
 */
interface DateRangeValue {
    startDate: string;
    endDate: string;
}

/**
 * Configuration for date range fields.
 * @property type - Must be 'daterange'
 * @property defaultValue - Optional initial date range
 */
interface DateRangeField {
    name: string;
    label: string;
    type: 'daterange';
    defaultValue?: DateRangeValue;
}

/**
 * Configuration for range input fields.
 * @property min - Minimum value
 * @property max - Maximum value
 * @property step - Step increment
 */
interface RangeField extends BaseField {
    type: 'range';
    min?: number;
    max?: number;
    step?: number;
}

/**
 * Configuration for file input fields.
 * @property accept - Allowed file types
 * @property multiple - Whether multiple files can be selected
 */
interface FileField extends BaseField {
    type: 'file';
    accept?: string;
    multiple?: boolean;
}

// Update the Field type union
export type Field = BaseField | OptionsField | DateRangeField | RangeField | FileField;

// Add type guards for new field types
/**
 * Type guard to check if a field is a range input.
 * @param field - Field to check
 * @returns True if field is a range input
 */
function isRangeField(field: Field): field is RangeField {
    return field.type === 'range';
}

/**
 * Type guard to check if a field is a file input.
 * @param field - Field to check
 * @returns True if field is a file input
 */
function isFileField(field: Field): field is FileField {
    return field.type === 'file';
}

// Type guards
function isOptionsField(field: Field): field is OptionsField {
    return 'options' in field;
}

function isDateRangeField(field: Field): field is DateRangeField {
    return field.type === 'daterange';
}

export interface UFormProps {
    fields: Field[];
    onSubmit: (data: Record<string, any>) => void;
    layout?: 'vertical' | 'horizontal';
    validation?: Record<string, (value: any, formData?: Record<string, any>) => true | string>;
    onChange?: (data: Record<string, any>) => void;
    position?: string; // Remove if not being used
}

const UForm: React.FC<UFormProps> = ({
    fields,
    onSubmit,
    layout = 'vertical',
    validation,
    onChange,
    position = '' // Remove if not being used
}) => {
    // Initialize form data with proper default values
    const initialFormData = fields.reduce((acc, field) => {
        if (isOptionsField(field) && field.type === 'checkbox' && field.multiple) {
            acc[field.name] = field.defaultValue || [];
        } else {
            acc[field.name] = field.defaultValue || '';
        }
        return acc;
    }, {} as Record<string, any>);

    const [formData, setFormData] = useState<Record<string, any>>(initialFormData);
    const [focusedFields, setFocusedFields] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const prevDataRef = useRef<Record<string, any>>({}); // Initializing with an empty object

    // Re-initialize when fields change
    useEffect(() => {
        const newFormData = { ...formData };
        let updated = false;

        fields.forEach(field => {
            if (!(field.name in formData)) {
                if (isOptionsField(field) && field.type === 'checkbox' && field.multiple) {
                    newFormData[field.name] = field.defaultValue || [];
                } else {
                    newFormData[field.name] = field.defaultValue || '';
                }
                updated = true;
            }
        });

        if (updated) {
            setFormData(newFormData);
        }
    }, [fields]);

    // Handle change in field value
    useEffect(() => {
        // Filter out circular structures or invalid data
        const cleanedData = Object.fromEntries(
            Object.entries(formData).filter(([_, val]) => {
                return typeof val !== 'object' || val === null || !('current' in val);
            })
        );
        
        // Compare cleanedData with previous cleanedData to avoid unnecessary rerenders
        if (JSON.stringify(cleanedData) !== JSON.stringify(prevDataRef.current)) {
            if (onChange) {
                onChange(cleanedData);
            }
            prevDataRef.current = cleanedData; // Update the previous data after calling onChange
        }
    }, [formData, onChange]);
    
    // Update handleChange to only update state
    const handleChange = (fieldName: string, value: any) => {
        //For Validate form data when change
        setFormData((prev) => {
            const updated = { ...prev, [fieldName]: value };
            if (onChange) {
                onChange(updated);
            }
            return updated;
        });

        if (validation && validation[fieldName]) {
            const result = validation[fieldName](value, { ...formData, [fieldName]: value });
            if (typeof result === 'string') {
                setErrors((prev) => ({ ...prev, [fieldName]: result }));
            } else if (result === true) {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                });
            }
        }
    };

    // Handle focus event
    const handleFocus = (fieldName: string) => {
        setFocusedFields((prev) => ({ ...prev, [fieldName]: true }));
    };

    // Handle blur event
    const handleBlur = (fieldName: string, value: any) => {
        setFocusedFields((prev) => ({ ...prev, [fieldName]: !!value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        let hasErrors = false;

        fields.forEach((field) => {
            if (validation && validation[field.name]) {
                const value = formData[field.name] || (isOptionsField(field) && field.type === 'checkbox' && field.multiple ? [] : '');
                const result = validation[field.name](value, formData);
                if (typeof result === 'string') {
                    newErrors[field.name] = result;
                    hasErrors = true;
                }
            }
        });

        setErrors(newErrors);
        if (!hasErrors) {
            onSubmit(formData);
        }
    };

    // Render individual field
    const renderField = (field: Field) => {
        const { name, type, label } = field;
        const value = formData[name] !== undefined ? formData[name] : (
            isOptionsField(field) && field.type === 'checkbox' && field.multiple ? [] : 
            isDateRangeField(field) ? { startDate: '', endDate: '' } : ''
        );
        const isFocused = focusedFields[name] || !!value;
        const error = errors[name];
        const isHorizontal = layout === 'horizontal';
    
        const labelClass = `text-sm font-medium mb-1 ${isFocused ? 'text-blue-500' : 'text-gray-700'}`;
        const inputClass = `block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-black`;
    
        // For daterange fields
        if (isDateRangeField(field)) {
            const dateValue = (value as DateRangeValue) || { startDate: '', endDate: '' };
            return (
                <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                    {isHorizontal && (
                        <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                            {label}
                        </label>
                    )}
                    <div className="flex-1">
                        {!isHorizontal && (
                            <label htmlFor={name} className={labelClass}>
                                {label}
                            </label>
                        )}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="date"
                                    id={`${name}-start`}
                                    name={`${name}-start`}
                                    value={dateValue.startDate}
                                    onChange={(e) => handleChange(name, { ...dateValue, startDate: e.target.value })}
                                    onFocus={() => handleFocus(name)}
                                    onBlur={(e) => handleBlur(name, { ...dateValue, startDate: e.target.value })}
                                    className={inputClass}
                                    aria-label={`${label} Start Date`}
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="date"
                                    id={`${name}-end`}
                                    name={`${name}-end`}
                                    value={dateValue.endDate}
                                    onChange={(e) => handleChange(name, { ...dateValue, endDate: e.target.value })}
                                    onFocus={() => handleFocus(name)}
                                    onBlur={(e) => handleBlur(name, { ...dateValue, endDate: e.target.value })}
                                    className={inputClass}
                                    aria-label={`${label} End Date`}
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>
            );
        }

        // For basic input fields
        if (!isOptionsField(field)) {
            if (field.type === 'textarea') {
                return (
                    <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                        {isHorizontal && (
                            <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                                {label}
                            </label>
                        )}
                        <div className="flex-1">
                            {!isHorizontal && (
                                <label htmlFor={name} className={labelClass}>
                                    {label}
                                </label>
                            )}
                            <textarea
                                name={name}
                                id={name}
                                value={value?.toString() || ''}
                                onChange={(e) => handleChange(name, e.target.value)}
                                onFocus={() => handleFocus(name)}
                                onBlur={(e) => handleBlur(name, e.target.value)}
                                placeholder={label}
                                className={`${inputClass} min-h-[100px] resize-y`}
                                aria-label={label}
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    </div>
                );
            }
            if (isRangeField(field)) {
                const { min = 0, max = 100, step = 1 } = field;
                return (
                    <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                        {isHorizontal && (
                            <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                                {label}
                            </label>
                        )}
                        <div className="flex-1">
                            {!isHorizontal && (
                                <label htmlFor={name} className={labelClass}>
                                    {label}
                                </label>
                            )}
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    name={name}
                                    id={name}
                                    min={min}
                                    max={max}
                                    step={step}
                                    value={value?.toString() || '0'}
                                    onChange={(e) => handleChange(name, e.target.value)}
                                    onFocus={() => handleFocus(name)}
                                    onBlur={(e) => handleBlur(name, e.target.value)}
                                    className="w-full"
                                    aria-label={label}
                                />
                                <span className="text-sm text-gray-600">{value}</span>
                            </div>
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    </div>
                );
            }
            if (isFileField(field)) {
                return (
                    <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                        {isHorizontal && (
                            <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                                {label}
                            </label>
                        )}
                        <div className="flex-1">
                            {!isHorizontal && (
                                <label htmlFor={name} className={labelClass}>
                                    {label}
                                </label>
                            )}
                            <input
                                type="file"
                                name={name}
                                id={name}
                                accept={field.accept}
                                multiple={field.multiple}
                                onChange={(e) => {
                                    const files = e.target.files;
                                    handleChange(name, field.multiple ? Array.from(files || []) : files?.[0] || null);
                                }}
                                onFocus={() => handleFocus(name)}
                                onBlur={(e) => handleBlur(name, e.target.files)}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                aria-label={label}
                            />
                            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                        </div>
                    </div>
                );
            }

            // For other input types (text, number, email, password, date, tel, url, search, time, datetime-local, color)
            return (
                <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                    {isHorizontal && (
                        <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                            {label}
                        </label>
                    )}
                    <div className="flex-1">
                        {!isHorizontal && (
                            <label htmlFor={name} className={labelClass}>
                                {label}
                            </label>
                        )}
                        <input
                            type={type}
                            name={name}
                            id={name}
                            value={value?.toString() || ''}
                            onChange={(e) => handleChange(name, e.target.value)}
                            onFocus={() => handleFocus(name)}
                            onBlur={(e) => handleBlur(name, e.target.value)}
                            placeholder={label}
                            className={inputClass}
                            aria-label={label}
                        />
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>
            );
        }

        // For select fields
        if (field.type === 'select') {
            return (
                <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                    {isHorizontal && (
                        <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                            {label}
                        </label>
                    )}
                    <div className="flex-1">
                        {!isHorizontal && (
                            <label htmlFor={name} className={labelClass}>
                                {label}
                            </label>
                        )}
                        <div className="relative">
                            <select
                                id={name}
                                name={name}
                                value={value as string}
                                onChange={(e) => handleChange(name, e.target.value)}
                                onFocus={() => handleFocus(name)}
                                onBlur={(e) => handleBlur(name, e.target.value)}
                                className={`${inputClass} appearance-none cursor-pointer pr-8`}
                                aria-label={label}
                            >
                                <option value="" className="text-gray-500">Select {label}</option>
                                {field.options.map((opt) => (
                                    <option key={`${name}-${opt}`} value={opt} className="text-black">
                                        {opt}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>
            );
        }

        // For checkbox fields
        if (field.type === 'checkbox' && field.multiple) {
            const checkboxValues = Array.isArray(value) ? value : [];
            return (
                <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                    {isHorizontal && (
                        <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                            {label}
                        </label>
                    )}
                    <div className="flex-1">
                        {!isHorizontal && (
                            <label htmlFor={name} className={labelClass}>
                                {label}
                            </label>
                        )}
                        <div className="space-y-2">
                            {field.options.map((option) => (
                                <div key={`${name}-${option}`} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`${name}-${option}`}
                                        name={name}
                                        value={option}
                                        checked={checkboxValues.includes(option)}
                                        onChange={(e) => {
                                            const updatedValue = e.target.checked
                                                ? [...checkboxValues, option]
                                                : checkboxValues.filter((item: string) => item !== option);
                                            handleChange(name, updatedValue);
                                        }}
                                        className="h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                </div>
            );
        }

        // For radio fields
        return (
            <div className={`mb-6 ${isHorizontal ? 'flex items-start gap-4' : ''}`}>
                {isHorizontal && (
                    <label htmlFor={name} className={`w-32 pt-2 text-right ${labelClass}`}>
                        {label}
                    </label>
                )}
                <div className="flex-1">
                    {!isHorizontal && (
                        <label htmlFor={name} className={labelClass}>
                            {label}
                        </label>
                    )}
                    <div className="space-y-2">
                        {field.options.map((option) => (
                            <div key={`${name}-${option}`} className="flex items-center">
                                <input
                                    type="radio"
                                    id={`${name}-${option}`}
                                    name={name}
                                    value={option}
                                    checked={value === option}
                                    onChange={() => handleChange(name, option)}
                                    className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor={`${name}-${option}`} className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                    {option}
                                </label>
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
            </div>
        );
    };

    // For plugin state persistence
    useEffect(() => {
        //For load saved state if exists
        const savedState = localStorage.getItem('u-form-state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                setFormData(parsedState);
            } catch (error) {
                console.error('Failed to load saved state:', error);
            }
        }
    }, []);

    //For save state on changes
    useEffect(() => {
        localStorage.setItem('u-form-state', JSON.stringify(formData));
    }, [formData]);

    return (
        <form onSubmit={handleSubmit} className={`u-form ${layout} ${position}`}>
        {fields.map((field, index) => (
            // Add a unique key prop here
            <div key={field.name || index}>
                {renderField(field)}
            </div>
        ))}
        <div className={`mt-4 ${layout === 'horizontal' ? 'ml-32' : ''}`}>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Submit
            </button>
        </div>
    </form>
    );
};

export default UForm;

export const UFormPlugin: Plugin = {
    id: 'u-form',
    name: 'Dynamic Form',
    description: 'A flexible and extensible form component',
    section: 'content',
    component: UForm,
    config: {
        layout: 'vertical',
        position: 'left',
        fields: [],
        validation: {},
        onSubmit: async (data: Record<string, any>) => {
            try {
                //For validate data before submit
                const isValid = Object.values(data).every(value => 
                    value !== undefined && value !== null && value !== ''
                );
                //For handle errors
                if (!isValid) {
                    throw new Error('Please fill in all required fields');
                }              
                
                return {
                    success: true,
                    message: 'Form submitted successfully'
                };
            } catch (error) {
                //For handle errors appropriately
                const errorMessage = error instanceof Error ? error.message : 'Form submission failed';
                
                return {
                    success: false,
                    message: errorMessage
                };
            }
        }
    } as UFormProps
};