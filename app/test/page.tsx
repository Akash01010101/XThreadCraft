"use client"
import React, { useContext } from 'react'
import {
    Grid,
    SearchBar,
    SearchContext,
    SearchContextManager,
    SuggestionBar,
} from '@giphy/react-components'

const SearchExperience = () => (
    <SearchContextManager apiKey={'mrcuaT5UhkCZRXcWoBvUFTGNkzTgJfL9'}>
        <Components />
    </SearchContextManager>
)

const Components = () => {
    const { fetchGifs, searchKey } = useContext(SearchContext)

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold mb-6">GIF Search</h1>
            <div className="w-full max-w-lg">
                <SearchBar />
                <SuggestionBar />
            </div>
            <div className="mt-2 max-h-[400px] overflow-y-auto">
                <Grid 
                    key={searchKey} 
                    columns={2} 
                    width={400} 
                    fetchGifs={fetchGifs} 
                    className="gap-4 p-4 bg-gray-800 rounded-lg shadow-lg"
                    onGifClick={(gif, event) => {
                        event.preventDefault(); // Prevent navigation if inside an anchor tag
                        const gifUrl = gif.images.original.url;
                        console.log("Selected GIF URL:", gifUrl);
                    
                        // Trigger download
                        fetch(gifUrl)
                            .then(response => response.blob())
                            .then(blob => {
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "giphy.gif"; // Set filename
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(url); // Clean up
                            })
                            .catch(error => console.error("Download failed:", error));
                    }}
                    
                />
            </div>
        </div>
    )
}

export default SearchExperience // ✅ Ensure there's a proper default export
