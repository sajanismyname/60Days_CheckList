import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { DayCurriculum, DayProgress } from '../../types';
import { Copy, Check, Twitter, ExternalLink } from 'lucide-react';

interface XPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayCurriculum: DayCurriculum;
  dayProgress: DayProgress;
  onUpdateDay: (updates: Partial<DayProgress>) => void;
}

export const XPostModal: React.FC<XPostModalProps> = ({
  isOpen,
  onClose,
  dayCurriculum,
  dayProgress,
  onUpdateDay,
}) => {
  const [templateText, setTemplateText] = useState('');
  const [copied, setCopied] = useState(false);
  const [postUrl, setPostUrl] = useState(dayProgress.xPostUrl || '');
  const [isPosted, setIsPosted] = useState(dayProgress.xPosted || false);

  // Generate template on open or when day changes
  useEffect(() => {
    if (isOpen) {
      const topicTags = dayCurriculum.learningTopics
        .map((t) => `#${t.replace(/\s+/g, '')}`)
        .slice(0, 3)
        .join(' ');

      const lcInfo = dayProgress.leetcodeProblems && dayProgress.leetcodeProblems.length > 0
        ? dayProgress.leetcodeProblems.map((p) => `• ${p.number}. ${p.title} (${p.difficulty})`).join('\n')
        : (dayCurriculum.leetcodeFocus ? `• Target: ${dayCurriculum.leetcodeFocus}` : '1–2 problems solved');

      const initial = `Day ${dayCurriculum.day}/60 of #60DaysOfLearning 🚀

Today's focus: ${dayCurriculum.title}

💡 Biggest takeaway:
${dayProgress.biggestTakeaway || 'Mastered key architectural patterns and internal mechanics.'}

🛠️ What I built:
${dayProgress.whatIBuilt || 'Hands-on practice exercises & code implementations.'}

💻 LeetCode:
${lcInfo}

${topicTags} #SoftwareEngineering #BuildInPublic`;

      setTemplateText(initial);
      setPostUrl(dayProgress.xPostUrl || '');
      setIsPosted(dayProgress.xPosted || false);
      setCopied(false);
    }
  }, [isOpen, dayCurriculum, dayProgress]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(templateText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = templateText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveStatus = () => {
    onUpdateDay({
      xPosted: isPosted,
      xPostUrl: postUrl.trim(),
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Share Day ${dayCurriculum.day} on X`}
      description="Copy your customized daily progress template to publish on X (Twitter)."
    >
      <div className="space-y-4 pt-1">
        {/* Editable Template Textarea */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label className="font-semibold text-foreground">Post Draft (Editable)</label>
            <span className="font-mono text-muted-foreground">{templateText.length} characters</span>
          </div>
          <Textarea
            value={templateText}
            onChange={(e) => setTemplateText(e.target.value)}
            className="h-48 font-mono text-xs leading-relaxed bg-secondary/30"
            placeholder="Write your tweet update..."
          />
        </div>

        {/* Copy Button & Direct Link */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Post Template</span>
              </>
            )}
          </Button>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(templateText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors"
          >
            <Twitter className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Open X Intent</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* X Post URL & Status */}
        <div className="rounded-lg border border-border/70 bg-secondary/20 p-3 space-y-3">
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="x-posted-checkbox"
              checked={isPosted}
              onChange={(e) => setIsPosted(e.target.checked)}
              className="h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="x-posted-checkbox" className="text-xs font-semibold text-foreground cursor-pointer select-none">
              Mark as Posted on X
            </label>
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1">
              X Post URL (optional)
            </label>
            <Input
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://x.com/username/status/..."
              className="h-8 text-xs bg-background"
            />
          </div>
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveStatus} className="text-xs">
            Save Status
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
