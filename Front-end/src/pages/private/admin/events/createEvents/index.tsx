import PageTitle from "../../../../../components/pageTitle"
import EventForm from "../common/event-form"

function CreateEventsPage() {
  return (
    <div className="px-2">
      <PageTitle title="Create Event" />
      <div className="mt-10 mr-3">
        <EventForm />
      </div>
    </div>
  )
}

export default CreateEventsPage