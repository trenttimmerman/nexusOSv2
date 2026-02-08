// DesignerWizard.tsx - Designer V3 Main Wizard Container
// Phase 1: Foundation shell for AI-powered header generation workflow

import React, { useState } from 'react';
import { DesignerStep, DesignerWizardState, HeaderConfig, SharedHeaderLibrary } from '../types/designer';

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
   * Complete wizard and return to admin
   */
  const handleCompleteWizard = () => {
    if (wizardState.customizedHeaderConfig) {
      onComplete(wizardState.customizedHeaderConfig);
    } else if (wizardState.selectedHeaderConfig) {
      onComplete(wizardState.selectedHeaderConfig);
    }
  };

  /**
   * Render current step
   */
  const renderStep = () => {
    switch (wizardState.currentStep) {
      case DesignerStep.HEADER_SELECTION:
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-4xl w-full p-8">
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Choose Your Header Design</h1>
              <p className="text-gray-600 mb-8" style={{ color: '#000000' }}>
                Select from our library or generate 3 unique designs with AI
              </p>
              
              {/* Phase 2: HeaderSelectionStep component */}
              <div className="space-y-4">
                <button
                  onClick={handleGenerateHeaders}
                  disabled={wizardState.isGenerating}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {wizardState.isGenerating ? 'Generating...' : '🎨 Generate 3 AI Designs'}
                </button>
                
                <div className="text-center text-gray-500" style={{ color: '#000000' }}>
                  or
                </div>
                
                <button
                  onClick={() => {/* Phase 2: Show library */}}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  style={{ color: '#000000' }}
                >
                  📚 Browse Shared Library
                </button>
              </div>
            </div>
          </div>
        );

      case DesignerStep.HEADER_CUSTOMIZATION:
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-4xl w-full p-8">
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Customize Your Header</h1>
              <p className="text-gray-600 mb-8" style={{ color: '#000000' }}>
                Full-screen editor coming in Phase 4
              </p>
              
              {/* Phase 4: HeaderEditorStep component */}
              <button
                onClick={() => handleSaveCustomization(wizardState.selectedHeaderConfig!)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save & Continue
              </button>
            </div>
          </div>
        );

      case DesignerStep.SAVE_TO_LIBRARY:
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-4xl w-full p-8">
              <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>Share Your Design?</h1>
              <p className="text-gray-600 mb-8" style={{ color: '#000000' }}>
                Add your custom header to the community library
              </p>
              
              {/* Phase 5: LibrarySaveStep component */}
              <div className="space-y-4">
                <button
                  onClick={handleCompleteWizard}
                  className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add to Library & Complete
                </button>
                
                <button
                  onClick={handleCompleteWizard}
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  style={{ color: '#000000' }}
                >
                  Skip & Complete
                </button>
              </div>
            </div>
          </div>
        );

      case DesignerStep.COMPLETE:
        handleCompleteWizard();
        return null;

      default:
        return null;
    }
  };

  return (
    <div className="designer-wizard fixed inset-0 z-50 bg-white">
      {/* Progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ 
            width: `${(Object.values(DesignerStep).indexOf(wizardState.currentStep) + 1) / 4 * 100}%` 
          }}
        />
      </div>

      {/* Cancel button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          style={{ color: '#000000' }}
        >
          ✕ Cancel
        </button>
      )}

      {/* Step content */}
      {renderStep()}

      {/* Back button (except on first step) */}
      {wizardState.currentStep !== DesignerStep.HEADER_SELECTION && (
        <button
          onClick={handlePreviousStep}
          className="absolute bottom-8 left-8 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          style={{ color: '#000000' }}
        >
          ← Back
        </button>
      )}
    </div>
  );
};
