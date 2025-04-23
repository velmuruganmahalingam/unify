import React, { useState } from 'react';
import { Plugin } from '../types';
import UForm from '../../components/UForm/U-Form';
import type { Field } from '../../components/UForm/U-Form';

/**
 * Interface defining the form state structure
 * @property isValid - Indicates if the form data is valid
 * @property data - Contains the form field values
 */
interface FormState {
    isValid: boolean;
    data: Record<string, any>;
}

/**
 * Demo Form Component
 * A component that demonstrates the usage of UForm with basic validation
 * and state management functionality.
 */
const DemoFormComponent: React.FC = () => {
    // Initialize form state with default values
    const [formState, setFormState] = useState<FormState>({
        isValid: true,
        data: {}
    });

    // Define form fields configuration
    const fields: Field[] = [
        {
            name: 'example',
            label: 'Example Field',
            type: 'text'
        }
    ];

    /**
     * Handles form submission
     * @param data - Form data to be submitted
     * @returns Object containing success status and message
     */
    const handleSubmit = async (data: Record<string, any>) => {
        try {
            // For Validate form before submit
            if (!formState.isValid) {
                throw new Error('Please fix form errors before submitting');
            }

            return {
                success: true,
                message: 'Form submitted successfully'
            };
        } catch (error) {
            // For Handle errors
            const errorMessage = error instanceof Error ? error.message : 'Form submission failed';
            
            return {
                success: false,
                message: errorMessage
            };
        }
    };

    /**
     * Handles form field changes
     * @param data - Updated form data
     */
    const handleChange = (data: Record<string, any>) => {
        // For Validate form data when change
        const hasErrors = Object.entries(data).some(([key, value]) => {
            if (!value && value !== 0) {
                return true; 
            }
            return false;
        });

        // Update form state with validation results
        setFormState(prevState => ({
            ...prevState,
            isValid: !hasErrors,
            data
        }));
    };

    return (
        <div className="p-4">
            <h2>Demo Form Plugin</h2>
            <UForm
                fields={fields}
                onSubmit={handleSubmit}
                onChange={handleChange}
                layout="vertical"
            />
        </div>
    );
};

/**
 * Demo Form Plugin Configuration
 * Exports the plugin configuration for the demo form component
 */
export const DemoFormPlugin: Plugin = {
    id: 'demo-form',
    name: 'Demo Form Plugin',
    description: 'A simple demo form plugin',
    section: 'content',
    component: DemoFormComponent,
    config: {
        enabled: true,
        position: 'top',
        settings: {}
    }
};