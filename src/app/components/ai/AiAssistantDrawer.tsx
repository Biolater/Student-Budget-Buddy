'use client'

import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  Tooltip
} from '@heroui/react';
import { ChatBubbleLeftRightIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * AIAssistantDrawer
 * Floating chat button that opens a HeroUI Drawer for AI assistant interactions.
 * Features blur backdrop, animations, and responsive design.
 */
export function AIAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Custom motion props for smooth animations
  const motionProps = {
    variants: {
      enter: {
        x: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: [0.36, 0.66, 0.4, 1],
        },
      },
      exit: {
        x: 100,
        opacity: 0,
        transition: {
          duration: 0.2,
          ease: [0.36, 0.66, 0.4, 1],
        },
      },
    },
  };

  return (
    <>
      {/* Floating Chat Button with Tooltip */}
      <Tooltip content="Ask your AI assistant" placement="left">
        <button
          aria-label="Open AI Assistant"
          className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-focus z-50 transition-transform hover:scale-105 active:scale-95"
          onClick={() => setIsOpen(true)}
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-success animate-pulse"></span>
        </button>
      </Tooltip>

      {/* HeroUI Drawer with blur backdrop and animations */}
      <Drawer 
      hideCloseButton
        placement="right" 
        isOpen={isOpen} 
        onOpenChange={setIsOpen}
        size="sm"
        backdrop="blur"
        motionProps={motionProps}
        classNames={{
          base: "rounded-l-xl",
          header: "border-b border-divider",
          body: "px-4",
          backdrop: "bg-background/80"
        }}
      >
        <DrawerContent>
          <DrawerHeader >
            <div className="flex grow items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Assistant</h2>
              </div>
              <Button 
                isIconOnly 
                variant="light" 
                radius="full" 
                aria-label="Close AI Assistant"
                onPress={() => setIsOpen(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
            </div>
          </DrawerHeader>

          <DrawerBody>
            {/* TODO: Replace this placeholder with your AI chat component */}
            <div className="h-full flex flex-col justify-center items-center text-muted-foreground space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-center">Your AI assistant is ready to help.<br/>What would you like to know?</p>
            </div>
          </DrawerBody>

          <DrawerFooter>
            {/* Quick prompts or actions */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Try asking:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button 
                  color="primary" 
                  variant="flat" 
                  className="justify-start text-left" 
                  startContent={<SparklesIcon className="h-4 w-4" />}
                >
                  How much did I spend this month?
                </Button>
                <Button 
                  color="primary" 
                  variant="flat" 
                  className="justify-start text-left" 
                  startContent={<SparklesIcon className="h-4 w-4" />}
                >
                  Show my budget summary
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
