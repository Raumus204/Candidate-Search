import { type FormEvent, useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import type Candidate from "../interfaces/Candidate.interface";
import CandidateCard from "../components/CandidateCard";

const CandidateSearch = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate>({
    id: 0,
    login: "",
    avatar_url: "",
    name: "",
    location: "",
    email: "",
    company: "",
    bio: "",
  });
  const [searchInput, setSearchInput] = useState<string>('');

  // Fetch random candidates when the page loads using your custom searchGithub
  useEffect(() => {
    const fetchRandomCandidate = async () => {
      const data = await searchGithub(); // Custom random user fetch
      if (data.length > 0) {
        const randomUser = data[0];
        const detailedUser = await searchGithubUser(randomUser.login || "");
        setCurrentCandidate(detailedUser); // Set the candidate
      }
    };
    fetchRandomCandidate();
  }, []);

  const saveCandidate = () => {
    let parsedCandidate: Candidate[] = [];
    const storedCandidates = localStorage.getItem('savedCandidates');
    if (typeof storedCandidates === 'string') {
      parsedCandidate = JSON.parse(storedCandidates);
    }
    parsedCandidate.push(currentCandidate);
    localStorage.setItem('savedCandidates', JSON.stringify(parsedCandidate));
  };

  const searchCandidate = async (event: FormEvent, search: string) => {
    event.preventDefault();
    try {
      const data: Candidate = await searchGithubUser(search);
      console.log('Searched Candidate Data:', data); // Log the search result to inspect it since 90% of the time it shows N/A

      // Ensure that the returned candidate data has all necessary fields
      setCurrentCandidate(data); 
    } catch (error) {
      console.log('Error searching for candidate:', error);
    }
    setSearchInput(""); // Clear search input after search
  };

  // Fetch random users
  const nextCandidate = async () => {
    try {
      const randomUsers = await searchGithub(); 
      for (const user of randomUsers) {
        try {
          const detailedUser = await searchGithubUser(user.login || ""); 
          if (detailedUser && detailedUser.login) {
            setCurrentCandidate(detailedUser);
            return; 
          }
        } catch (error) {
          if (error instanceof Error) {
            console.log(`Skipping user ${user.login} due to error: ${error.message}`); // not working
          } else {
            console.log(`Skipping user ${user.login} due to an unknown error`); // not working
          }
          continue;
        }
      }
      console.log("No valid users found in this batch.");
    } catch (error) {
      console.error("Error fetching random users:", error);
    }
  };
  

  return (
    <>
      <section id="searchSection">
        <form onSubmit={(event: FormEvent) => searchCandidate(event, searchInput)}>
          <input
            type="text"
            placeholder="Search for a candidate"
            onChange={(event) => setSearchInput(event.target.value)}
            value={searchInput}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      {/* CandidateCard will re-render when currentCandidate changes */}
      <CandidateCard
        currentCandidate={currentCandidate}
        handleSaveCandidate={saveCandidate}
        handleNextCandidate={nextCandidate}
      />
      
    </>
  );
};

export default CandidateSearch;
