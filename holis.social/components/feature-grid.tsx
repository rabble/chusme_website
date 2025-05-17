import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface FeatureGridProps {
  title?: string;
  description?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ 
  title, 
  description, 
  features, 
  columns = 3 
}: FeatureGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        {(title || description) && (
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            {title && <h2 className="text-3xl font-bold tracking-tighter">{title}</h2>}
            {description && (
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        <div className={`grid grid-cols-1 gap-6 ${gridCols[columns]}`}>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                {feature.icon && (
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {feature.icon}
                  </div>
                )}
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}