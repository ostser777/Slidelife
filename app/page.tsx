"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Topic = "Sports" | "Travel" | "Study" | "Work" | "Everyday life";
type Reaction = "love" | "inspired" | "relatable" | null;
type Upload = { id: string; url: string; type: string };

type Story = {
  id: string;
  topic: Topic;
  title: string;
  caption: string;
  place: string;
  image: string;
  slideCount: number;
  demo?: boolean;
};

const TOPICS: { name: Topic; icon: string }[] = [
  { name: "Sports", icon: "✦" },
  { name: "Travel", icon: "✈" },
  { name: "Study", icon: "◫" },
  { name: "Work", icon: "▣" },
  { name: "Everyday life", icon: "☼" },
];

const DEMO_STORIES: Story[] = [
  { id: "barcelona", topic: "Travel", title: "A morning ride in Barcelona", caption: "Sun, coffee, and a different view of the city.", place: "Barcelona, Spain", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=85", slideCount: 6, demo: true },
  { id: "warsaw", topic: "Sports", title: "Before the city wakes", caption: "Five quiet kilometres by the river before my first meeting.", place: "Warsaw, Poland", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=85", slideCount: 5, demo: true },
  { id: "tokyo", topic: "Study", title: "Library light", caption: "A slow afternoon of notes, sketches, and one good idea.", place: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=85", slideCount: 7, demo: true },
  { id: "lisbon", topic: "Work", title: "A studio day in Lisbon", caption: "Making space for focus between conversations.", place: "Lisbon, Portugal", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85", slideCount: 5, demo: true },
  { id: "seoul", topic: "Everyday life", title: "Little things, Seoul", caption: "Breakfast, a bookshop, rain, and a call home.", place: "Seoul, South Korea", image: "https://images.unsplash.com/photo-1538485399081-7c8979d91e5f?auto=format&fit=crop&w=1200&q=85", slideCount: 8, demo: true },
  { id: "cape-town", topic: "Sports", title: "Sea level, sunrise", caption: "My weekend trail starts where the road ends.", place: "Cape Town, South Africa", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=85", slideCount: 6, demo: true },
  { id: "kyoto", topic: "Travel", title: "One unplanned turn", caption: "The best part of travelling is leaving room for surprise.", place: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=85", slideCount: 6, demo: true },
  { id: "berlin", topic: "Study", title: "Learning in public", caption: "A study group, a whiteboard, and less perfection.", place: "Berlin, Germany", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85", slideCount: 5, demo: true },
  { id: "brooklyn", topic: "Work", title: "The idea took a walk", caption: "A desk day became better after twenty minutes outside.", place: "Brooklyn, USA", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85", slideCount: 5, demo: true },
  { id: "naples", topic: "Everyday life", title: "An ordinary good day", caption: "Some days need no big reason to remember them.", place: "Naples, Italy", image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=85", slideCount: 4, demo: true },
];

const OUTLINES: Record<Topic, string[]> = {
  Sports: ["Your first movement", "One moment that challenged you", "How you recover"],
  Travel: ["A place that caught your eye", "One unexpected detail", "The feeling you take with you"],
  Study: ["What you are learning", "A small breakthrough", "What you will try next"],
  Work: ["How your day begins", "One meaningful task", "A pause that helped"],
  "Everyday life": ["Your morning ritual", "One unexpected moment", "How you end the day"],
};

export default function Home() {
  const [activeTopic, setActiveTopic] = useState<Topic | "For you">("For you");
  const [stories, setStories] = useState<Story[]>(DEMO_STORIES);
  const [storyIndex, setStoryIndex] = useState(0);
  const [reaction, setReaction] = useState<Reaction>(null);
  const [screen, setScreen] = useState<"feed" | "idea" | "create" | "editor">("feed");
  const [draftTopic, setDraftTopic] = useState<Topic>("Everyday life");
  const [draftTitle, setDraftTitle] = useState("Your everyday adventure");
  const [draftCaption, setDraftCaption] = useState("Capture the moments that made this day yours.");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const visibleStories = useMemo(
    () => activeTopic === "For you" ? stories : stories.filter((item) => item.topic === activeTopic),
    [activeTopic, stories],
  );
  const currentStory = visibleStories[storyIndex % Math.max(visibleStories.length, 1)] ?? stories[0];
  const firstVisual = uploads.find((item) => item.type.startsWith("image/"))?.url ?? currentStory.image;

  function selectTopic(topic: Topic | "For you") {
    setActiveTopic(topic);
    setStoryIndex(0);
    setReaction(null);
  }

  function skipStory() {
    setStoryIndex((value) => value + 1);
    setReaction(null);
  }

  function startReply() {
    setDraftTopic(currentStory.topic);
    setDraftTitle("My " + currentStory.topic.toLowerCase() + " story");
    setDraftCaption("Inspired by “" + currentStory.title + "”.");
    setScreen("idea");
  }

  function openCreate() {
    setDraftTopic("Everyday life");
    setDraftTitle("Your everyday adventure");
    setDraftCaption("Capture the moments that made this day yours.");
    setScreen("create");
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, 10);
    const nextUploads = selectedFiles.map((file) => ({
      id: file.name + file.lastModified,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setUploads(nextUploads);
  }

  function generateDraft() {
    if (!uploads.length) return;
    setIsGenerating(true);
    window.setTimeout(() => {
      const category = draftTopic === "Everyday life" ? "everyday" : draftTopic.toLowerCase();
      setDraftTitle(description.trim() ? "A " + category + " day worth keeping" : "My " + category + " story");
      setDraftCaption(description.trim() || "A short visual story made from the moments you chose.");
      setIsGenerating(false);
      setScreen("editor");
    }, 800);
  }

  function publishStory() {
    const nextStory: Story = {
      id: "user-" + Date.now(),
      topic: draftTopic,
      title: draftTitle,
      caption: draftCaption,
      place: "Your local story",
      image: firstVisual,
      slideCount: Math.max(uploads.length, 1),
    };
    setStories((previousStories) => [nextStory, ...previousStories]);
    setActiveTopic("For you");
    setStoryIndex(0);
    setUploads([]);
    setDescription("");
    setScreen("feed");
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 3400);
  }

  return (
    <main>
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <section className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top">Slide<span>Life</span></a>
          <div className="header-actions">
            <button className="icon-button" aria-label="Search">⌕</button>
            <button className="icon-button" aria-label="Profile">◯</button>
          </div>
        </header>

        {screen === "feed" && (
          <>
            <div className="intro">
              <p className="eyebrow">A day moves around the world</p>
              <h1>See life through someone else&apos;s eyes.</h1>
            </div>
            <div className="topic-scroll" role="tablist" aria-label="Story topics">
              <button className={activeTopic === "For you" ? "topic active" : "topic"} onClick={() => selectTopic("For you")}>For you</button>
              {TOPICS.map((topic) => (
                <button className={activeTopic === topic.name ? "topic active" : "topic"} key={topic.name} onClick={() => selectTopic(topic.name)}>
                  {topic.icon} {topic.name}
                </button>
              ))}
            </div>

            <article className="story-card" style={{ backgroundImage: "linear-gradient(180deg, rgba(8,20,52,.08) 20%, rgba(8,20,52,.8) 100%), url(" + currentStory.image + ")" }}>
              <div className="story-top">
                <span className="story-badge">{currentStory.demo ? "Demo story" : "Your story"}</span>
                <span>{Math.min(storyIndex + 1, visibleStories.length)} of {visibleStories.length}</span>
              </div>
              <div className="progress" aria-label={"Slide 1 of " + currentStory.slideCount}>
                {Array.from({ length: Math.min(currentStory.slideCount, 6) }).map((_, index) => <i className={index === 0 ? "filled" : ""} key={index} />)}
              </div>
              <div className="story-copy">
                <p className="place">{currentStory.place}</p>
                <h2>{currentStory.title}</h2>
                <p>{currentStory.caption}</p>
              </div>
              <div className="story-footer">
                <div className="reactions" aria-label="React to this story">
                  <button className={reaction === "love" ? "reaction selected" : "reaction"} onClick={() => setReaction(reaction === "love" ? null : "love")} aria-label="Love">♥</button>
                  <button className={reaction === "inspired" ? "reaction selected" : "reaction"} onClick={() => setReaction(reaction === "inspired" ? null : "inspired")} aria-label="Inspired">✦</button>
                  <button className={reaction === "relatable" ? "reaction selected" : "reaction"} onClick={() => setReaction(reaction === "relatable" ? null : "relatable")} aria-label="Relatable">◌</button>
                </div>
                <button className="reply-button" onClick={startReply}>▣ <span>Create a reply</span></button>
                <button className="skip-button" onClick={skipStory}>Skip</button>
              </div>
            </article>
            <button className="create-link" onClick={openCreate}>＋ <span>Create your story</span></button>
          </>
        )}

        {screen === "idea" && (
          <section className="panel">
            <button className="back" onClick={() => setScreen("feed")}>← Back to story</button>
            <p className="eyebrow">A reply idea for you</p>
            <h2>Your {draftTopic.toLowerCase()} adventure</h2>
            <p className="panel-lead">Your story will connect to {currentStory.place} through a shared {draftTopic.toLowerCase()} moment.</p>
            <div className="outline">
              {OUTLINES[draftTopic].map((item, index) => <div key={item}><span>0{index + 1}</span><p>{item}</p></div>)}
            </div>
            <button className="primary" onClick={() => setScreen("create")}>Use this idea <span>→</span></button>
            <button className="secondary" onClick={() => setScreen("create")}>Choose another topic</button>
          </section>
        )}

        {screen === "create" && (
          <section className="panel">
            <button className="back" onClick={() => setScreen("feed")}>← Back to feed</button>
            <p className="eyebrow">Create a story</p>
            <h2>Show us your day.</h2>
            <p className="panel-lead">Add 1–10 photos or short videos. Your story remains visible only in this session.</p>
            <label className="field-label">Topic
              <select value={draftTopic} onChange={(event) => setDraftTopic(event.target.value as Topic)}>
                {TOPICS.map((topic) => <option key={topic.name}>{topic.name}</option>)}
              </select>
            </label>
            <label className="upload">
              <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple onChange={handleFiles} />
              <span>＋</span><strong>Add photos or short videos</strong><small>JPEG, PNG, WebP, MP4 or WebM · up to 10 files</small>
            </label>
            {uploads.length > 0 && <div className="uploads">{uploads.map((upload) => upload.type.startsWith("video/") ? <video key={upload.id} src={upload.url} muted /> : <img key={upload.id} src={upload.url} alt="Selected upload preview" />)}</div>}
            <label className="field-label">Tell us a little about the day
              <textarea value={description} onChange={(event) => setDescription(event.target.value.slice(0, 2000))} placeholder="Morning coffee, a long walk, a new idea…" />
              <small>{description.length}/2000</small>
            </label>
            <button className="primary" disabled={!uploads.length || isGenerating} onClick={generateDraft}>{isGenerating ? "Creating your story…" : "Create story"} <span>→</span></button>
          </section>
        )}

        {screen === "editor" && (
          <section className="panel">
            <button className="back" onClick={() => setScreen("create")}>← Edit materials</button>
            <p className="eyebrow">Your draft is ready</p>
            <h2>Make it yours.</h2>
            <div className="editor-preview" style={{ backgroundImage: "linear-gradient(180deg, transparent 20%, rgba(8,20,52,.76)), url(" + firstVisual + ")" }}>
              <span>1 / {Math.max(uploads.length, 1)}</span><strong>{draftTitle}</strong>
            </div>
            <label className="field-label">Story title<input value={draftTitle} maxLength={80} onChange={(event) => setDraftTitle(event.target.value)} /></label>
            <label className="field-label">Caption<textarea value={draftCaption} maxLength={180} onChange={(event) => setDraftCaption(event.target.value)} /></label>
            <button className="primary" onClick={publishStory}>Publish for this session <span>→</span></button>
            <p className="session-note">Your story is visible only in this session and disappears when you refresh.</p>
          </section>
        )}
      </section>
      {showToast && <div className="toast"><span>✦</span><div><strong>Published for this session</strong><p>Your story is now first in the feed.</p></div></div>}
    </main>
  );
}

