export default function Remarkable() {
  return (
    <>
  <section class="page">
    <h1>My Recipe Book</h1>
    <h2>Contents</h2>

    <h3>Breakfast</h3>
    <ul>
      <li><a href="#recipe-banana-pancakes">Banana Pancakes</a></li>
      <li><a href="#recipe-oats">Overnight Oats</a></li>
    </ul>
  </section>

  <section class="page recipe-page" id="recipe-banana-pancakes">
    <h2>Banana Pancakes</h2>
    <p><a href="#top">Back to contents</a></p>
  </section>

  <section class="page recipe-page" id="recipe-oats">
    <h2>Overnight Oats</h2>
    <p><a href="#top">Back to contents</a></p>
  </section>
    </>
  );
}
