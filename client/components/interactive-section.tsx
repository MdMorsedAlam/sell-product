"use client";

import { useLanguage } from "../providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { useApi, usePatchForPoll } from "@/hooks/useApi";
import { IPoll } from "@/lib/content-models";
import toast from "react-hot-toast";

export default function InteractiveSection() {
  const { language, t } = useLanguage();
  const { data, isLoading, refetch } = useApi<IPoll[]>(["poll"], "/poll");
  const [pollData, setPollData] = useState<IPoll | null>(null);
  // const [quiz, setQuiz] = useState<any>(mockQuizData); // Set mock data for quiz if not fetched
  const [selectedPollOption, setSelectedPollOption] = useState<string>("");
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [pollResults, setPollResults] = useState<any>({});
  const patchPoll = usePatchForPoll(
    (pollId, optionId) => `/poll/${pollId}/vote/${optionId}`,
    ["poll", "votes"]
  );
  // Fetch poll data from the backend
  useEffect(() => {
    const fetchPollData = async () => {
      await refetch();
      if (data) {
        setPollData(data[0]); // Assuming data[0] contains the current poll
      }
    };
    fetchPollData();
  }, [data, refetch]);

  const getTotalVotes = () => {
    // Calculate the total number of votes by summing all the votes
    return (
      pollData?.options.reduce(
        (total: number, option: any) => total + option.votes,
        0
      ) || 0
    );
  };

  const getPercentage = (votes: number) => {
    // Calculate percentage for the given option based on total votes
    const total = getTotalVotes();
    return total > 0 ? Math.round((votes / total) * 100) : 0;
  };

  const handleVote = async () => {
    if (pollData && selectedPollOption) {
      try {
        // Send the PATCH request using the mutation
        await patchPoll.mutateAsync({
          pollId: pollData._id!,
          optionId: selectedPollOption, // Pass the optionId
          data: {}, // Add the required data property (empty object if not needed)
        });
        setHasVoted(true);
        await refetch();
        setPollResults(
          pollData.options.reduce((results: any, option: any) => {
            results[option.id] = option.votes;
            return results;
          }, {})
        );
        toast.success("Vote submitted successfully!");
      } catch (error) {
        toast.error("Failed to submit vote.");
      }
    }
  };

  if (isLoading || !pollData) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="border-l-4 border-red-600 pl-2">
          {t("section.interactive")}
        </span>
      </h2>

      <Tabs defaultValue="poll">
        <TabsList className="w-full">
          <TabsTrigger value="poll" className="flex-1">
            {t("poll.title")}
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex-1">
            {t("quiz.title")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="poll">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{pollData.question}</CardTitle>
            </CardHeader>
            <CardContent>
              {!hasVoted ? (
                <>
                  <RadioGroup
                    value={selectedPollOption}
                    onValueChange={setSelectedPollOption}
                    className="space-y-3"
                  >
                    {pollData.options.map((option: any) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button
                    className="w-full mt-4"
                    onClick={handleVote}
                    disabled={!selectedPollOption}
                  >
                    {t("poll.vote")}
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium">{t("poll.results")}</h3>
                  {pollData.options.map((option: any) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.option}</span>
                        <span>{getPercentage(option.votes)}%</span>
                      </div>
                      <Progress
                        value={getPercentage(option.votes)}
                        className="h-2"
                      />
                    </div>
                  ))}
                  <div className="text-sm text-muted-foreground">
                    Total votes: {getTotalVotes()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {quiz.description}
              </p>
              <Button className="w-full">{t("quiz.start")}</Button>
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </section>
  );
}
