# Dublin Sports Mentor - Ladder Ranking System Documentation

## Overview

The ladder ranking system provides a competitive framework for players to challenge each other and track their progress. The system includes:

- Men's and women's ranking ladders
- Player division/skill level indicators
- Match recording functionality
- Challenge system
- Ladder registration

## Main Ladder Page

The main ladder page (`app/ladder/page.tsx`) serves as the central hub for the ladder ranking system.

### Key Features

#### 1. Tabbed Interface for Gender Separation

```tsx
<Tabs defaultValue="mens" className="w-full" onValueChange={setActiveTab}>
  <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
    <TabsTrigger value="mens">Men's Ladder</TabsTrigger>
    <TabsTrigger value="womens">Women's Ladder</TabsTrigger>
  </TabsList>
  
  <TabsContent value="mens">
    {/* Men's ladder content */}
  </TabsContent>
  
  <TabsContent value="womens">
    {/* Women's ladder content */}
  </TabsContent>
</Tabs>