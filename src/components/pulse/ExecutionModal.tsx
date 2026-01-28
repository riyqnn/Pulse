import type { PulsePrompt } from '../../types';

interface ExecutionModalProps {
  prompt: PulsePrompt | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ExecutionModal({ prompt, isOpen, onConfirm, onCancel }: ExecutionModalProps) {
  if (!isOpen || !prompt) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Trade</h2>

        {/* Strategy */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Strategy: {prompt.strategy.type}</h3>
          <div className="space-y-2 text-sm">
            {prompt.strategy.legs.map((leg, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-600">{leg.side.toUpperCase()}:</span>
                <span className="font-medium">{leg.instrument}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">You receive:</span>
            <span className="font-bold text-green-600">
              ${prompt.strategy.maxGain}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Your risk:</span>
            <span className="font-bold text-red-600">
              ${prompt.strategy.maxLoss}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Breakeven:</span>
            <span className="font-medium text-gray-700">
              ${prompt.strategy.breakeven.join(', ')}
            </span>
          </div>
        </div>

        {/* Execution Details */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-900 font-semibold mb-2">
            <span className="text-sm">⚡</span>
            <span>Executing via Thetanuts</span>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• Contract: OptionBook (0xAbC...123)</div>
            <div>• Method: trade() with limit order</div>
            <div>• Zero counterparty risk (fully collateralized)</div>
            <div>• Settlement guaranteed in 7 days</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            CONFIRM EXECUTION
          </button>
        </div>
      </div>
    </div>
  );
}
