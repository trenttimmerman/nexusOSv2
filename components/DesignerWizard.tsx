// DesignerWizard.tsx - Designer V3 Main Wizard Container
// Integrated with all step components

import React, { useState } from 'react';
import { DesignerStep, DesignerWizardState, HeaderConfig, SharedHeaderLibrary } from '../types/designer';
import { HeaderSelectionStep } from './designer/HeaderSelectionStep';
import { HeaderEditorStep } from './designer/HeaderEditorStep';
import { LibrarySaveStep } from './designer/LibrarySaveStep';

/**
 * DesignerWizard component props
 */
interface DesignerWizardProps {
  storeId: string;
  storeName: string;
  onComplete: (headerConfig: HeaderConfig) => void;
  onCancel?: () => void;
}

/**
 * DesignerWizard - Full-screen wizard for AI-powered header generation
 * 
 * Flow:
 * 1. Header Selection - Choose from library or generate 3 new AI designs
 * 2. Header Customization - Full-screen editor with live preview
 * 3. Save to Library - Optionally share custom design with community
 * 4. Complete - Return to admin panel
 */
export const DesignerWizard: React.FC<DesignerWizardProps> = ({
  storeId,
  storeName,
  onComplete,
  onCancel,
}) => {
  const [wizardState, setWizardState] = useState<DesignerWizardState>({
    currentStep: DesignerStep.HEADER_SELECTION,
    isGenerating: false,
  });

  /**
   * Navigate to next step in wizard
   */
  const handleNextStep = () => {
    const stepOrder = [
      DesignerStep.HEADER_SELECTION,
      DesignerStep.HEADER_CUSTOMIZATION,
      DesignerStep.SAVE_TO_LIBRARY,
      DesignerStep.COMPLETE,
    ];
    const currentIndex = stepOrder.indexOf(wizardState.currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setWizardState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex + 1],
      }));
    }
  };

  /**
   * Navigate to previous step in wizard
   */
  const handlePreviousStep = () => {
    const stepOrder = [
      DesignerStep.HEADER_SELECTION,
      DesignerStep.HEADER_CUSTOMIZATION,
      DesignerStep.SAVE_TO_LIBRARY,
      DesignerStep.COMPLETE,
    ];
    const currentIndex = stepOrder.indexOf(wizardState.currentStep);
    if (currentIndex > 0) {
      setWizardState(prev => ({
        ...prev,
        currentStep: stepOrder[currentIndex - 1],
      }));
    }
  };

  /**
   * Handle header selection from library
   */
  const handleSelectHeader = (header: SharedHeaderLibrary) => {
    setWizardState(prev => ({
      ...prev,
      selectedHeaderId: header.id,
      selectedHeaderConfig: header.config,
    }));
    handleNextStep();
  };

  /**
   * Handle header config update
   */
  const handleUpdateConfig = (config: HeaderConfig) => {
    setWizardState(prev => ({
      ...prev,
      customizedHeaderConfig: config,
    }));
  };

  /**
   * Handle AI header generation (3 designs)
   * Phase 3: Will call /api/ai/generate-headers
   */
  const handleGenerateHeaders = async () => {
    setWizardState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      // TODO Phase 3: Implement Gemini API call
      // const response = await fetch('/api/ai/generate-headers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     storeId,
      //     brandName: storeName,
      //   }),
      // });
      // const data = await response.json();
      // setWizardState(prev => ({
      //   ...prev,
      //   generatedHeaders: data.headers,
      //   isGenerating: false,
      // }));
      
      console.log('AI header generation coming in Phase 3');
      setWizardState(prev => ({ ...prev, isGenerating: false }));
    } catch (error) {
      console.error('Header generation failed:', error);
      setWizardState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  /**
   * Handle header customization save
   */
  const handleSaveCustomization = (config: HeaderConfig) => {
    setWizardState(prev => ({
      ...prev,
      customizedHeaderConfig: config,
    }));
    handleNextStep();
  };

  /**
   * Complete wizard and return final header config
   */
  const handleCompleteWizard = () => {
    const finalConfig = wizardState.customizedHeaderConfig || wizardState.selectedHeaderConfig;
    if (finalConfig) {
      onComplete(finalConfig);
    } else {
      console.error('[DesignerWizard] No header config to complete with');
      // Fallback: close wizard
      onCancel?.();
    }
  };

  /**
   * Skip to complete (from editor or library save)
   */
  const handleSkipToComplete = () => {
    handleCompleteWizard();
  };

  /**
   * Render current step
   */
  const renderStep = () => {
    switch (wizardState.currentStep) {
      case DesignerStep.HEADER_SELECTION:
        return (
          <HeaderSelectionStep
            storeId={storeId}
            storeName={storeName}
            onSelectHeader={handleSelectHeader}
            onBack={onCancel}
          />
        );

      case DesignerStep.HEADER_CUSTOMIZATION:
        if (!wizardState.selectedHeaderConfig) {
          // Fallback: go back to selection
          handlePreviousStep();
          return null;
        }
        return (
          <HeaderEditorStep
            headerConfig={wizardState.customizedHeaderConfig || wizardState.selectedHeaderConfig}
            headerVariant="canvas" // TODO: detect from selected header
            onUpdateConfig={handleUpdateConfig}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
            onSkipToComplete={handleSkipToComplete}
          />
        );

      case DesignerStep.SAVE_TO_LIBRARY:
        const finalConfig = wizardState.customizedHeaderConfig || wizardState.selectedHeaderConfig;
        if (!finalConfig) {
          handlePreviousStep();
          return null;
        }
        return (
          <LibrarySaveStep
            storeId={storeId}
            headerConfig={finalConfig}
            headerVariant="canvas" // TODO: detect from selected header
            onComplete={(saved, headerId) => {
              console.log('Library save complete:', { saved, headerId });
              handleCompleteWizard();
            }}
            onBack={handlePreviousStep}
            onSkip={handleCompleteWizard}
          />
        );

      case DesignerStep.COMPLETE:
        handleCompleteWizard();
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="designer-wizard">
      {renderStep()}
    </div>
  );
};
