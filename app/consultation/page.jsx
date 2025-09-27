import ConsultationBookingForm from "@/src/components/consultation-booking-form";

export default function ConsultationPage() {
  return (
    <section
      id="services"
      className="flex flex-col items-center bg-primary-blue py-20"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14"
        style={{ paddingTop: "100px" }}
      >
        <div className="container mx-auto px-4">
          <ConsultationBookingForm />
        </div>
      </div>
    </section>
  );
}
