const HOME_STATEMENT =
  'Building backend systems with less complexity and more trust.';

const HOME_CONTEXT = 'Currently building';
const PARK_SERVICE_URL = 'https://www.981park.com';

export default function HomePage() {
  return (
    <main>
      <section aria-labelledby="home-statement">
        <h1 id="home-statement" className="sr-only">
          {HOME_STATEMENT}
        </h1>
        <p className="ark-home-statement">
          {HOME_STATEMENT}
          <br />
          {HOME_CONTEXT}{' '}
          <a
            className="ark-home-statement-service-link"
            href={PARK_SERVICE_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            @9.81park
          </a>
          .
        </p>
      </section>
    </main>
  );
}
