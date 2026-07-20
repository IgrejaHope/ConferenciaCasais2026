import * as React from "react"
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = FormProvider

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> = {
    name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return React.createElement(FormFieldContext.Provider, { value: { name: props.name } }, React.createElement(Controller as any, props))
  }

const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()
  const fieldState = getFieldState(fieldContext.name, formState)
  if (!fieldContext) {
        throw new Error("useFormField should be used within <FormField>")
          }
          const { id } = itemContext
          return {
                id,
                name: fieldContext.name,
            formItemId: `${id}-form-item`,
            formDescriptionId: `${id}-form-item-description`,
            formMessageId: `${id}-form-item-message`,
            ...fieldState,
          }
          }
        
        type FormItemContextValue = {
            id: string
          }
        
        const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)
        
        const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
            const { className, ...rest } = props
          const id = React.useId()
          return React.createElement(FormItemContext.Provider, { value: { id } }, React.createElement("div", { ref, className: cn("space-y-2", className), ...rest }))
          })
        FormItem.displayName = "FormItem"
        
        const FormLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>((props, ref) => {
            const { className, ...rest } = props
          const { error, formItemId } = useFormField()
          return React.createElement("label", {
                ref,
                className: cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", error && "text-destructive", className),
            htmlFor: formItemId,
            ...rest,
          })
          })
        FormLabel.displayName = "FormLabel"
        
        const FormControl = React.forwardRef<any, React.HTMLAttributes<any>>((props, ref) => {
            const { error, formItemId, formDescriptionId, formMessageId } = useFormField()
          const child = React.Children.only(props.children) as React.ReactElement
          return React.cloneElement(child, {
                ref,
                id: formItemId,
            "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
            "aria-invalid": !!error,
            ...child.props as any,
          })
          })
        FormControl.displayName = "FormControl"
        
        const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>((props, ref) => {
            const { className, ...rest } = props
          const { formDescriptionId } = useFormField()
          return React.createElement("p", { ref, id: formDescriptionId, className: cn("text-[0.8rem] text-muted-foreground", className), ...rest })
          })
        FormDescription.displayName = "FormDescription"
        
        const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>((props, ref) => {
            const { className, children, ...rest } = props
          const { error, formMessageId } = useFormField()
          const body = error ? String(error?.message) : children
          if (!body) {
                return null
          }
          return React.createElement("p", { ref, id: formMessageId, className: cn("text-[0.8rem] font-medium text-destructive", className), ...rest }, body)
          })
        FormMessage.displayName = "FormMessage"
        
        export {
            useFormField,
            Form,
            FormItem,
            FormLabel,
            FormControl,
            FormDescription,
            FormMessage,
            FormField,
        
        }
