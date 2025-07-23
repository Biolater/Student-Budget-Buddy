"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  Tabs,
  Tab,
  Card,
  CardBody,
  addToast,
} from "@heroui/react";
// Import useCurrency hook which now includes the mutation
import { useCurrency } from "@/app/hooks/useCurrency";

interface UserSettingsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserSettingsModal({
  isOpen,
  onOpenChange,
}: UserSettingsModalProps) {

  // Use Tanstack Query hooks for data fetching
  const { 
    query: currenciesQuery, 
    fetchDefaultUserCurrency: defaultCurrencyQuery 
  } = useCurrency();
  
  const currencies = currenciesQuery.data || [];
  const defaultCurrency = defaultCurrencyQuery.data;
  const isLoading = currenciesQuery.isLoading || defaultCurrencyQuery.isLoading;

  // State for selected currency
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string>("");

  // Set selected currency when default currency data is available or when modal opens
  useEffect(() => {
    if (isOpen && defaultCurrency && defaultCurrency.id) {
      setSelectedCurrencyId(defaultCurrency.id);
    }
  }, [defaultCurrency, isOpen]);

  // Use the mutation from useCurrency hook
  const { updateBaseCurrency } = useCurrency();
  const isUpdating = updateBaseCurrency.isPending;

  // Handle currency change
  const handleUpdateCurrency = async () => {
    if (!selectedCurrencyId) return;

    try {
      await updateBaseCurrency.mutateAsync(selectedCurrencyId);
      addToast({
        title: "Success",
        description: "Base currency updated successfully",
        color: "success"
      });
    } catch (error) {
      console.error("Failed to update currency:", error);
      addToast({
        title: "Error",
        description: "Failed to update base currency",
        color: "danger"
      });
    }
  };



  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <Tabs>
            <Tab key="preferences" title="Preferences">
              <Card>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Base Currency</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select your preferred base currency for the application
                      </p>
                      
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex-1">
                          {defaultCurrency && (
                            <div className="mb-2 text-sm">
                              <span className="font-medium">Current currency:</span> {defaultCurrency.code} - {defaultCurrency.name} ({defaultCurrency.symbol})
                            </div>
                          )}
                          <Select
                            label="Base Currency"
                            selectionMode="single"
                            size="sm"
                            selectedKeys={selectedCurrencyId ? [selectedCurrencyId] : []}
                            onSelectionChange={(keys) => {
                              if (keys instanceof Set && keys.size > 0) {
                                const selectedKey = Array.from(keys)[0];
                                // Make sure the key is a string
                                setSelectedCurrencyId(String(selectedKey));
                              }
                            }}
                            isDisabled={isLoading}
                            className="w-full"
                            variant="bordered"
                            selectorIcon={<ChevronDownIcon className="size-4" />}
                            renderValue={(items) => {
                              const selectedCurrency = currencies.find(c => c.id === selectedCurrencyId);
                              return selectedCurrency ? (
                                <div>
                                  {selectedCurrency.code} - {selectedCurrency.name} ({selectedCurrency.symbol})
                                </div>
                              ) : null;
                            }}
                          >
                            {currencies.map((currency) => (
                              <SelectItem key={currency.id} textValue={`${currency.code} - ${currency.name}`}>
                                {currency.code} - {currency.name} ({currency.symbol})
                              </SelectItem>
                            ))}
                          </Select>
                        </div>
                        
                        <Button
                          color="primary"
                          onPress={handleUpdateCurrency}
                          isLoading={isUpdating}
                          isDisabled={isLoading || isUpdating || !selectedCurrencyId || selectedCurrencyId === defaultCurrency?.id}
                        >
                          Update Currency
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
            
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onPress={() => onOpenChange(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
