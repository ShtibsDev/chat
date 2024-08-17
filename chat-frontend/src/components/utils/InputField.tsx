import type { Control, FieldPath, FieldValues } from 'react-hook-form';

import { type ComponentProps } from 'react';
import { Input } from '../ui/input';
import type { ClassValue } from 'clsx';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type InputFieldProps<T extends FieldValues> = {
	name: FieldPath<T>;
	label?: string;
	placeholder?: string;
	description?: string;
	inputType?: ComponentProps<typeof Input>['type'];
	formControl: Control<T>;
	className?: ClassValue;
};

export default function InputField<T extends FieldValues>(props: InputFieldProps<T>) {
	const { name, label, placeholder, formControl, description, className, inputType = 'text' } = props;
	return (
		<FormField
			name={name}
			control={formControl}
			render={({ field }) => (
				<FormItem className={className as string}>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<Input type={inputType} placeholder={placeholder} {...field} />
					</FormControl>
					<FormMessage />
					{description ? <FormDescription>{description}</FormDescription> : null}
				</FormItem>
			)}
		/>
	);
}
