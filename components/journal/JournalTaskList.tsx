import React from 'react';
import { BookOpen, ChevronDown, Pencil, Save, X } from 'lucide-react';
import { Task, ResponsibilityOwner, TaskPolarity } from '../../types';

export interface JournalTaskListProps {
  t: (key: string, options?: any) => string;
  todayTasks: Task[];
  filteredTasks: Task[];
  filterOwner: string | null;
  setFilterOwner: (value: string | null) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  editingFocusSentence: string;
  setEditingFocusSentence: (value: string) => void;
  editingNote: string;
  setEditingNote: (value: string) => void;
  editingReality: string;
  setEditingReality: (value: string) => void;
  editingDistance: string;
  setEditingDistance: (value: string) => void;
  editingValue: string;
  setEditingValue: (value: string) => void;
  editingFinalMessage: string;
  setEditingFinalMessage: (value: string) => void;
  editingFocusAspect: 'self' | 'view' | 'future' | null;
  setEditingFocusAspect: (value: 'self' | 'view' | 'future' | null) => void;
  editingPerspective: 'reality' | 'distance' | 'value' | 'observe' | null;
  setEditingPerspective: (value: 'reality' | 'distance' | 'value' | 'observe' | null) => void;
  startEditing: (task: Task) => void;
  handleSaveJournal: (taskId: string) => void;
  getCategoryLabel: (cat: string, usePositive?: boolean) => string;
  getOwnerLabel: (owner: ResponsibilityOwner) => string;
  renderPerspectiveLabel: (perspective?: string | null) => React.ReactNode;
  renderPerspectiveHint: (perspective?: string | null) => string | null;
  renderFocusWithAspect: (task: Task) => string;
  selectedDate: string;
}

export const JournalTaskList: React.FC<JournalTaskListProps> = ({
  t,
  todayTasks,
  filteredTasks,
  filterOwner,
  setFilterOwner,
  editingId,
  setEditingId,
  editingFocusSentence,
  setEditingFocusSentence,
  editingNote,
  setEditingNote,
  editingReality,
  setEditingReality,
  editingDistance,
  setEditingDistance,
  editingValue,
  setEditingValue,
  editingFinalMessage,
  setEditingFinalMessage,
  editingFocusAspect,
  setEditingFocusAspect,
  editingPerspective,
  setEditingPerspective,
  startEditing,
  handleSaveJournal,
  getCategoryLabel,
  getOwnerLabel,
  renderPerspectiveLabel,
  renderPerspectiveHint,
  renderFocusWithAspect,
  selectedDate,
}) => (
  <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h3 className="font-bold text-base md:text-lg">{t('journal.details.title')}</h3>
      {todayTasks.length > 0 && (
        <div className="relative w-full sm:w-auto">
          <select
            value={filterOwner || ''}
            onChange={(e) => setFilterOwner(e.target.value || null)}
            className="appearance-none w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t('journal.details.filter.all')}</option>
            <option value={ResponsibilityOwner.Mine}>{t('journal.details.filter.mine')}</option>
            <option value={ResponsibilityOwner.Shared}>{t('journal.details.filter.shared')}</option>
            <option value={ResponsibilityOwner.Theirs}>{t('journal.details.filter.theirs')}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      )}
    </div>

    {filteredTasks.length > 0 ? (
      <div className="space-y-3 md:space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="border border-gray-100 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow"
          >
            {/* Task Header: four key elements */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1 min-w-0 space-y-2">
                {/* Final message as main focus */}
                {task.finalMessage && (
                  <div className="text-sm md:text-base font-semibold text-text break-words">
                    {task.finalMessage}
                  </div>
                )}

                {/* Emotion & boundary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                  <div className="space-y-0.5">
                    <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                      {t('journal.details.emotionLabel')}
                    </div>
                    <div className="font-medium break-words">
                      {Array.isArray(task.category)
                        ? task.category
                          .map((cat) =>
                            getCategoryLabel(
                              cat,
                              (task.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive,
                            ),
                          )
                          .join(', ')
                        : getCategoryLabel(
                          task.category as string,
                          (task.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive,
                        )}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                      {t('journal.details.boundaryLabel')}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded-full whitespace-nowrap text-xs md:text-sm">
                        {getOwnerLabel(task.owner as ResponsibilityOwner)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perspective & worry focus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                  <div className="space-y-0.5">
                    <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                      {t('journal.details.perspectiveLabel')}
                    </div>
                    <div className="font-medium break-words">
                      {renderPerspectiveLabel(task.perspective)}
                    </div>
                    {renderPerspectiveHint(task.perspective) && (
                      <div className="mt-0.5 text-[11px] md:text-xs text-gray-400">
                        {renderPerspectiveHint(task.perspective)}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                      {t('journal.details.focusLabel')}
                    </div>
                    <div className="break-words">
                      {renderFocusWithAspect(task)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journal Content - editable reflection */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              {editingId === task.id ? (
                <div className="space-y-4">
                  {/* 區塊標題：反思日記 */}
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-gray-500">
                      {t('journal.edit.label')}
                    </div>
                    <p className="text-[11px] md:text-xs text-gray-400">
                      {t('journal.edit.todayDiffHint')}
                    </p>
                  </div>

                  {/* 一句話情緒 */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500">
                      {t('newTask.step2.title')}
                    </label>
                    <input
                      type="text"
                      value={editingFocusSentence}
                      onChange={(e) => setEditingFocusSentence(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                    />
                    <div className="pt-1 space-y-1">
                      <div className="text-[11px] md:text-xs text-gray-400">
                        {t('newTask.step2.aspect.title')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(['self', 'view', 'future'] as const).map((key) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setEditingFocusAspect(
                                editingFocusAspect === key ? null : key,
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                              editingFocusAspect === key
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {t(`newTask.step2.aspect.${key}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 視角選擇 + 對應視角內容（僅選擇後才顯示輸入框） */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="text-[11px] md:text-xs text-gray-400">
                        {t('journal.details.perspectiveLabel')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {([
                          { key: 'reality', label: t('newTask.perspective.reality.title') },
                          { key: 'distance', label: t('newTask.perspective.distance.title') },
                          { key: 'value', label: t('newTask.perspective.value.title') },
                          { key: 'observe', label: t('newTask.perspective.observe.title') },
                        ] as const).map(({ key, label }) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() =>
                              setEditingPerspective(
                                editingPerspective === key ? null : key,
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                              editingPerspective === key
                                ? 'bg-primary/10 border-primary text-primary'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {editingPerspective === 'reality' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">
                          {t('newTask.perspective.reality.title')}
                        </label>
                        <textarea
                          value={editingReality}
                          onChange={(e) => setEditingReality(e.target.value)}
                          placeholder={t('journal.perspective.reality.placeholder')}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                        />
                      </div>
                    )}
                    {editingPerspective === 'distance' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">
                          {t('newTask.perspective.distance.title')}
                        </label>
                        <textarea
                          value={editingDistance}
                          onChange={(e) => setEditingDistance(e.target.value)}
                          placeholder={t('journal.perspective.distance.placeholder')}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                        />
                      </div>
                    )}
                    {editingPerspective === 'value' && (
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">
                          {t('newTask.perspective.value.title')}
                        </label>
                        <textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          placeholder={t('journal.perspective.value.placeholder')}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                        />
                      </div>
                    )}
                  </div>

                  {/* 最後一句話（同時作為整體反思收斂） */}
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500">
                      {t('newTask.finalMessage.label')}
                    </label>
                    <textarea
                      value={editingFinalMessage}
                      onChange={(e) => setEditingFinalMessage(e.target.value)}
                      placeholder={t('journal.edit.placeholder')}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm min-h-[56px]"
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm text-gray-500 hover:bg-gray-50"
                    >
                      <X className="w-3 h-3" />
                      {t('history.modal.cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveJournal(task.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs md:text-sm hover:bg-[#1e2b1e]"
                    >
                      <Save className="w-3 h-3" />
                      {t('journal.edit.save')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {task.reflection && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">{t('journal.view.label')}</span>
                        <button
                          type="button"
                          onClick={() => {
                            startEditing(task);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                        {task.reflection}
                      </div>
                    </div>
                  )}
                  {!task.reflection && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 italic">{t('journal.view.empty')}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(task.id);
                          setEditingFocusSentence('');
                          setEditingNote('');
                          setEditingReality('');
                          setEditingDistance('');
                          setEditingValue('');
                          setEditingFinalMessage('');
                          setEditingFocusAspect(null);
                          setEditingPerspective(task.perspective ?? null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      >
                        <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-gray-400">
        <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-sm">{t('journal.empty', { date: selectedDate })}</p>
      </div>
    )}
  </div>
);
