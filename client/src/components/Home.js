import React from 'react';

const Home = () => {
  const items = [
    { name: "Physics", content: "This is the content of card 1.", subcontent: "25-06-2025" },
    { name: "Chemistry", content: "This is the content of card 2.", subcontent: "26-06-2025" },
    { name: "Database Management Systems", content: "This is the content of card 3.", subcontent: "27-06-2025" },
    { name: "Card 4", content: "This is the content of card 4.", subcontent: "28-06-2025" },
    { name: "Card 5", content: "This is the content of card 5.", subcontent: "29-06-2025" },
    { name: "Card 6", content: "This is the content of card 6.", subcontent: "30-06-2025" },
    { name: "Card 7", content: "This is the content of card 7.", subcontent: "01-07-2025" },
    { name: "Card 8", content: "This is the content of card 8.", subcontent: "02-07-2025" }
  ];

  return (
    <div className="container mt-4">
      <div className="row">
        {items.map((item, index) => (
          <div className="col-12 col-sm-6 col-md-6 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title mb-0"> <strong>{item.name}</strong></h5>
                <small className="text-muted d-block">{item.subcontent}</small>
                <p className="card-text mt-2">{item.content}</p>
                <div className="mt-auto pt-3">
                  <button
                    className="btn"
                    style={{ backgroundColor: "#5f4e2fff", color: "white" }}
                  >
                    View
                  </button>
                  <button
                    className="btn ms-2"
                    style={{ backgroundColor: "#f5e6cc", color: "black" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
