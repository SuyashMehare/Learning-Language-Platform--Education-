import { useEffect, useMemo, useState, useCallback } from 'react';
import { fetchQuizOptions, fetchTagOptions, uploadLecture } from '../services/adminApi';
import './CreateLectures.css';

const difficultyOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const initialForm = {
  name: '',
  language: 'es',
  difficulty: 'A1',
  points: '',
};

function IconSparkles() {
  return (
    <svg className="cl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4M22 5h-4M4 17v2M5 18h2" />
    </svg>
  );
}

function IconTags() {
  return (
    <svg className="cl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}

function IconListChecks() {
  return (
    <svg className="cl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function IconArrowUpRight() {
  return (
    <svg className="cl-icon cl-icon--sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function AttachCard({ icon: Icon, title, description, onClick, active }) {
  return (
    <button
      type="button"
      className={`cl-attach-card${active ? ' cl-attach-card--active' : ''}`}
      onClick={onClick}
    >
      <span className="cl-attach-card__icon-wrap">
        <Icon />
      </span>
      <span className="cl-attach-card__text">
        <span className="cl-attach-card__title">{title}</span>
        <span className="cl-attach-card__desc">{description}</span>
      </span>
    </button>
  );
}

function UploadDropzone({ onFileSelected, disabled }) {
  const [dragOver, setDragOver] = useState(false);

  const pick = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (file && file.type.startsWith('video/')) {
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  return (
    <label
      className={`cl-dropzone${dragOver ? ' cl-dropzone--active' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        pick(e.dataTransfer?.files);
      }}
    >
      <input
        type="file"
        accept="video/*"
        className="cl-dropzone__input"
        disabled={disabled}
        onChange={(e) => pick(e.target.files)}
      />
      <span className="cl-dropzone__plus">+</span>
      <span className="cl-dropzone__title">Upload and preview</span>
      <span className="cl-dropzone__hint">Drop a video here or click to browse</span>
    </label>
  );
}

function VideoOverview({ file, previewUrl, onRemove }) {
  return (
    <div className="cl-video-overview">
      <div className="cl-video-overview__player-wrap">
        {previewUrl ? (
          <video src={previewUrl} controls className="cl-video-overview__video">
            <track kind="captions" />
          </video>
        ) : (
          <div className="cl-video-overview__empty">Preview unavailable</div>
        )}
      </div>
      <div className="cl-video-overview__meta">
        <p className="cl-video-overview__name">{file?.name || 'Video'}</p>
        <button type="button" className="cl-btn cl-btn--ghost" onClick={onRemove}>
          Remove video
        </button>
      </div>
    </div>
  );
}

export default function CreateLectures() {
  const [form, setForm] = useState(initialForm);
  const [videoFile, setVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [currentQuizId, setCurrentQuizId] = useState('');
  const [showTagsPanel, setShowTagsPanel] = useState(false);
  const [showQuizzesPanel, setShowQuizzesPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function loadOptions() {
      setFetchingOptions(true);
      try {
        const [tags, quizzes] = await Promise.all([fetchTagOptions(), fetchQuizOptions()]);
        if (!mounted) return;
        setAvailableTags(tags);
        setAvailableQuizzes(quizzes);
      } catch (loadError) {
        if (!mounted) return;
        setError(loadError.message || 'Unable to load tags and quizzes.');
      } finally {
        if (mounted) {
          setFetchingOptions(false);
        }
      }
    }
    loadOptions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!videoFile) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(videoFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [videoFile]);

  const selectedQuizSet = useMemo(() => new Set(selectedQuizzes.map((quiz) => quiz._id)), [selectedQuizzes]);

  function onInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function addTag() {
    if (!currentTag || selectedTags.includes(currentTag)) {
      return;
    }
    setSelectedTags((prev) => [...prev, currentTag]);
    setCurrentTag('');
  }

  function removeTag(tag) {
    setSelectedTags((prev) => prev.filter((item) => item !== tag));
  }

  function addQuiz() {
    const quizToAdd = availableQuizzes.find((quiz) => quiz._id === currentQuizId);
    if (!quizToAdd || selectedQuizSet.has(quizToAdd._id)) {
      return;
    }
    setSelectedQuizzes((prev) => [...prev, quizToAdd]);
    setCurrentQuizId('');
  }

  function removeQuiz(quizId) {
    setSelectedQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
  }

  function resetFormState() {
    setForm(initialForm);
    setVideoFile(null);
    setSelectedTags([]);
    setSelectedQuizzes([]);
    setCurrentTag('');
    setCurrentQuizId('');
  }

  function handleCancel() {
    setMessage('');
    setError('');
    resetFormState();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!videoFile) {
      setError('Please select a video file before uploading.');
      return;
    }

    if (!form.name.trim()) {
      setError('Lecture name is required.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('name', form.name.trim());
      formData.append('language', form.language);
      formData.append('difficulty', form.difficulty);
      if (form.points.trim()) {
        formData.append('points', form.points.trim());
      }
      formData.append('labels', JSON.stringify(selectedTags));
      formData.append('quizzes', JSON.stringify(selectedQuizzes.map((quiz) => quiz._id)));

      const result = await uploadLecture(formData);
      setMessage(result?.message || 'Lecture uploaded successfully.');
      resetFormState();
    } catch (uploadError) {
      setError(uploadError.message || 'Unable to upload lecture.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cl-studio">
      <div className="cl-studio__mesh" aria-hidden />
      <div className="cl-studio__glow" aria-hidden />

      <div className="cl-studio__inner">
        <header className="cl-header">
          <div className="cl-header__badge">
            <IconSparkles />
            Lecture studio
          </div>
          <h1 className="cl-header__title">Create Lecture</h1>
          <p className="cl-header__subtitle">
            Upload your video, attach tags and quizzes, then publish to your students.
          </p>
        </header>

        <form className="cl-card" onSubmit={handleSubmit}>
          <div className="cl-card__grid">
            <div className="cl-card__col-upload">
              <div className="cl-details">
                <label className="cl-field">
                  <span className="cl-field__label">Lecture name</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={onInputChange}
                    placeholder="e.g. Greetings in Spanish"
                    required
                  />
                </label>
                <div className="cl-details__row">
                  <label className="cl-field">
                    <span className="cl-field__label">Language</span>
                    <select name="language" value={form.language} onChange={onInputChange}>
                      <option value="es">Spanish (es)</option>
                      <option value="en">English (en)</option>
                    </select>
                  </label>
                  <label className="cl-field">
                    <span className="cl-field__label">Difficulty</span>
                    <select name="difficulty" value={form.difficulty} onChange={onInputChange}>
                      {difficultyOptions.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="cl-field">
                    <span className="cl-field__label">Points (optional)</span>
                    <input name="points" value={form.points} onChange={onInputChange} placeholder="Auto" />
                  </label>
                </div>
              </div>

              {videoFile ? (
                <VideoOverview file={videoFile} previewUrl={previewUrl} onRemove={() => setVideoFile(null)} />
              ) : (
                <UploadDropzone onFileSelected={setVideoFile} disabled={loading} />
              )}
            </div>

            <aside className="cl-card__col-attach">
              <AttachCard
                icon={IconTags}
                title="Attach tags"
                description="Help students discover this lecture"
                active={showTagsPanel}
                onClick={() => {
                  setShowTagsPanel((p) => !p);
                  setShowQuizzesPanel(false);
                }}
              />
              {showTagsPanel ? (
                <div className="cl-panel">
                  <div className="cl-panel__row">
                    <select
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      disabled={fetchingOptions}
                    >
                      <option value="">Select a tag</option>
                      {availableTags.map((tag) => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="cl-btn cl-btn--secondary" onClick={addTag}>
                      Add
                    </button>
                  </div>
                  <div className="cl-chips">
                    {selectedTags.map((tag) => (
                      <button key={tag} type="button" className="cl-chip" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <AttachCard
                icon={IconListChecks}
                title="Attach Quizzes"
                description="Test understanding with questions"
                active={showQuizzesPanel}
                onClick={() => {
                  setShowQuizzesPanel((p) => !p);
                  setShowTagsPanel(false);
                }}
              />
              {showQuizzesPanel ? (
                <div className="cl-panel">
                  <div className="cl-panel__row">
                    <select
                      value={currentQuizId}
                      onChange={(e) => setCurrentQuizId(e.target.value)}
                      disabled={fetchingOptions}
                    >
                      <option value="">Select a quiz</option>
                      {availableQuizzes.map((quiz) => (
                        <option key={quiz._id} value={quiz._id}>
                          {quiz.id} — {quiz.question}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="cl-btn cl-btn--secondary" onClick={addQuiz}>
                      Add
                    </button>
                  </div>
                  <div className="cl-chips">
                    {selectedQuizzes.map((quiz) => (
                      <button key={quiz._id} type="button" className="cl-chip" onClick={() => removeQuiz(quiz._id)}>
                        {quiz.id} ×
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="cl-tip">
                <div className="cl-tip__icon">
                  <IconSparkles />
                </div>
                <div>
                  <p className="cl-tip__title">Pro tip</p>
                  <p className="cl-tip__text">Lectures with tags and quizzes get more engagement from learners.</p>
                </div>
              </div>
            </aside>
          </div>

          <div className="cl-footer">
            <p className="cl-footer__hint">
              {videoFile ? 'Your lecture is ready to publish.' : 'Upload a video to get started.'}
            </p>
            <div className="cl-footer__actions">
              <button type="button" className="cl-btn cl-btn--ghost" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
              <button
                type="submit"
                className="cl-btn cl-btn--primary"
                disabled={!videoFile || loading || !form.name.trim()}
              >
                <span className="cl-btn__inner">
                  {loading ? 'Uploading...' : 'Upload'}
                  <IconArrowUpRight />
                </span>
              </button>
            </div>
          </div>
        </form>

        {message ? <p className="cl-toast cl-toast--success">{message}</p> : null}
        {error ? <p className="cl-toast cl-toast--error">{error}</p> : null}
      </div>
    </main>
  );
}
