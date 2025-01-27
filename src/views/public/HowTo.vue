<template>
  <div class="how-to-container">
    <button class="back-button" @click="$router.back()">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Back
    </button>

    <article class="how-to-content">
      <h1>Understanding Our Platform</h1>
      
      <section class="intro-section">
        <p>Our platform combines advanced stock market analysis with intuitive search capabilities. This guide will help you understand how to make the most of our features.</p>
      </section>

      <section>
        <h2>Getting Started with Search</h2>
        <p>The search functionality is the core of our platform. It's designed to understand natural language queries and provide relevant market insights.</p>
        
        <h3>Basic Search Principles</h3>
        <p>Our search bar accepts natural language queries. For example:</p>
        <ul>
          <li>"Show me tech stocks with high growth potential"</li>
          <li>"Find companies with strong dividends in the energy sector"</li>
          <li>"Compare Tesla and Ford performance since 2020"</li>
        </ul>

        <h3>Using Search Snippets</h3>
        <p>Above the search bar, you'll find quick-access snippets that represent common search patterns. These snippets are context-aware and change based on whether you have an active portfolio.</p>
        
        <div class="example-block">
          <strong>Default Snippets:</strong>
          <ul>
            <li>"What's the best stock to buy today?"</li>
            <li>"Top performing ETFs this week"</li>
            <li>"Market trends this week"</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Portfolio Management</h2>
        <p>Creating and managing your portfolio unlocks additional analysis capabilities.</p>

        <h3>Creating a Portfolio</h3>
        <p>Click the + button next to the search bar to create a new portfolio. You can:</p>
        <ul>
          <li>Add stocks manually by entering symbols</li>
          <li>Import from a Excel or CSV file</li>
          <li>Use our template portfolios as starting points</li>
        </ul>

        <h3>Portfolio-Specific Features</h3>
        <p>With an active portfolio, you gain access to:</p>
        <ul>
          <li>Portfolio-specific backtesting</li>
          <li>Risk analysis tools</li>
          <li>Performance comparisons</li>
          <li>Optimization suggestions</li>
        </ul>
      </section>

      <section>
        <h2>Advanced Search Techniques</h2>
        
        <h3>Combining Multiple Factors</h3>
        <p>Enhance your search accuracy by combining multiple factors:</p>
        <ul>
          <li>Market metrics (P/E ratio, market cap, volume)</li>
          <li>Technical indicators (Moving averages, RSI, MACD)</li>
          <li>Fundamental data (Revenue growth, profit margins)</li>
          <li>Time periods (YTD, 52-week range, custom dates)</li>
        </ul>

        <h3>Using Filters</h3>
        <p>Below the search bar, you'll find suggestion chips that help refine your search. These filters can be combined to create precise queries.</p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <p>To get the most accurate results:</p>
        <ul>
          <li>Be specific with your queries</li>
          <li>Include relevant time frames</li>
          <li>Use industry-standard terminology</li>
          <li>Save successful searches for future reference</li>
        </ul>
      </section>
    </article>
  </div>
</template>

<script setup>
// No additional script needed
</script>

<style scoped>
.how-to-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  padding-top: 6rem;
}

.back-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  color: #374151;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.back-button:hover {
  color: #535bf2;
}

.how-to-content {
  text-align: left;
  line-height: 1.7;
}

h1 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #111111, #535bf2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

h2 {
  font-size: 1.8rem;
  color: #111827;
  margin: 3rem 0 1.5rem;
}

h3 {
  font-size: 1.3rem;
  color: #111827;
  margin: 2rem 0 1rem;
}

p {
  color: #4b5563;
  margin-bottom: 1.5rem;
}

ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: #4b5563;
  margin-bottom: 1.5rem;
}

li {
  margin-bottom: 0.75rem;
}

.example-block {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #f9fafb;
  border-left: 3px solid #535bf2;
}

.intro-section {
  font-size: 1.1rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .how-to-container {
    padding-top: 4rem;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.2rem;
  }

  .back-button {
    top: 0.5rem;
    left: 0.5rem;
  }
}
</style>
