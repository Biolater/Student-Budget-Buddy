import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateBudgetFormSchemaType,
  CreateBudgetFormSchema,
} from "@/app/schema/budget.schema";
import { useCategory } from "@/app/hooks/useCategory";
import { useCurrency } from "@/app/hooks/useCurrency";
import { useAuth } from "@clerk/nextjs";
import { Select, SelectItem } from "@heroui/react";

const CreateBudgetForm = () => {
  const { userId } = useAuth();

  if (!userId) {
    return <div>Loading...</div>;
  }

  const {
    budgetCategoriesQuery: {
      data: categories,
      isPending: categoriesLoading,
      error: categoriesError,
    },
  } = useCategory();

  const {
    query: {
      data: currencies,
      isPending: currenciesLoading,
      error: currenciesError,
    },
  } = useCurrency(userId);

  const form = useForm<CreateBudgetFormSchemaType>({
    resolver: zodResolver(CreateBudgetFormSchema),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = (data: CreateBudgetFormSchemaType) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="budgetCategory"
        render={({ field }) => (
          <Select
            label="Budget Category"
            labelPlacement="outside"
            placeholder="Select budget category"
            errorMessage={errors.budgetCategory?.message}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0];
              field.onChange(selectedKey);
            }}
            isInvalid={!!errors.budgetCategory}
            selectedKeys={field.value ? [field.value] : []}
            isRequired
          >
            {categories!.map((option) => (
              <SelectItem
                textValue={`${option.icon} ${option.name}`}
                key={option.id}
              >
                {option.icon} {option.name}
              </SelectItem>
            ))}
          </Select>
        )}
      />
    </form>
  );
};

export default CreateBudgetForm;
