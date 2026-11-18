export default function Published({story}) {
  return <time dateTime={story.published_at}>{new Intl.DateTimeFormat('ar', {
    dateStyle:'full', timeZone:'Asia/Riyadh'
  }).format(new Date(story.published_at))}</time>;
}
